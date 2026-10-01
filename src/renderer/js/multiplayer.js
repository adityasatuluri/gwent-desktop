const dgram = require('dgram');
const net = require('net');

class Multiplayer {
    constructor() {
        this.username = localStorage.getItem('gwent_mp_username') || 'Player' + Math.floor(Math.random() * 10000);
        this.history = JSON.parse(localStorage.getItem('gwent_mp_history') || '[]');
        
        this.broadcastPort = 54321;
        this.hostPort = 54322;
        this.discoverClient = null;
        this.hostServer = null;
        this.broadcastInterval = null;
        
        this.discoveredServers = {}; // ip -> {name, lastSeen}
        this.isHosting = false;
        
        this.socket = null; // Connected socket (either host or client)
    }

    initUI() {
        document.getElementById('mp-username').value = this.username;
        document.getElementById('mp-username').addEventListener('input', (e) => {
            this.username = e.target.value;
            localStorage.setItem('gwent_mp_username', this.username);
        });

        document.getElementById('mp-host-btn').addEventListener('click', () => {
            if (this.isHosting) {
                this.stopHosting();
                document.getElementById('mp-host-btn').innerText = 'HOST GAME';
            } else {
                this.startHosting();
                document.getElementById('mp-host-btn').innerText = 'CANCEL HOSTING';
            }
        });

        this.renderHistory();
    }

    openLobby() {
        document.getElementById('multiplayer-lobby').classList.remove('hide');
        this.startDiscovery();
    }

    closeLobby() {
        document.getElementById('multiplayer-lobby').classList.add('hide');
        this.stopDiscovery();
        if (this.isHosting) this.stopHosting();
    }

    renderHistory() {
        const list = document.getElementById('mp-history-list');
        list.innerHTML = '';
        if (this.history.length === 0) {
            list.innerHTML = '<div style="color:#888; font-style:italic;">No matches played yet.</div>';
            return;
        }
        
        // Render last 50 matches, newest first
        [...this.history].reverse().slice(0, 50).forEach(h => {
            const el = document.createElement('div');
            el.className = `history-item ${h.result}`;
            el.innerHTML = `
                <div class="hist-header">
                    <span>vs <strong>${h.opponent}</strong></span>
                    <span>${new Date(h.time).toLocaleString()}</span>
                </div>
                <div style="color:#aaa;">Result: ${h.result.toUpperCase()}</div>
            `;
            list.appendChild(el);
        });
    }
    
    addHistory(opponent, result) {
        this.history.push({ opponent, result, time: Date.now() });
        localStorage.setItem('gwent_mp_history', JSON.stringify(this.history));
        this.renderHistory();
    }

    startDiscovery() {
        if (this.discoverClient) return;
        this.discoverClient = dgram.createSocket({ type: 'udp4', reuseAddr: true });
        
        this.discoverClient.on('message', (msg, rinfo) => {
            try {
                const data = JSON.parse(msg.toString());
                if (data.type === 'GWENT_HOST' && data.name !== this.username) {
                    this.discoveredServers[rinfo.address] = {
                        name: data.name,
                        lastSeen: Date.now(),
                        ip: rinfo.address
                    };
                    this.updateServerList();
                }
            } catch(e) {}
        });

        this.discoverClient.on('error', (err) => {
            console.error('UDP discover error:', err);
        });
        
        try {
            this.discoverClient.bind(this.broadcastPort, () => {
                try { this.discoverClient.addMembership('224.0.0.114'); } catch(e) {}
                this.discoverClient.setBroadcast(true);
            });
        } catch(e) {}

        // Prune old servers every 3 seconds
        this.pruneInterval = setInterval(() => {
            const now = Date.now();
            let changed = false;
            for (let ip in this.discoveredServers) {
                if (now - this.discoveredServers[ip].lastSeen > 5000) {
                    delete this.discoveredServers[ip];
                    changed = true;
                }
            }
            if (changed) this.updateServerList();
        }, 3000);
    }

    stopDiscovery() {
        if (this.discoverClient) {
            this.discoverClient.close();
            this.discoverClient = null;
        }
        if (this.pruneInterval) clearInterval(this.pruneInterval);
    }

    updateServerList() {
        const list = document.getElementById('mp-server-list');
        list.innerHTML = '';
        const servers = Object.values(this.discoveredServers);
        
        if (servers.length === 0) {
            list.innerHTML = '<div class="server-list-empty">Searching for players on local network...</div>';
            return;
        }

        servers.forEach(s => {
            const el = document.createElement('div');
            el.className = 'mp-list-item';
            el.innerHTML = `
                <span class="player-name">${s.name}</span>
                <button class="join-btn" onclick="mp.joinGame('${s.ip}')">JOIN</button>
            `;
            list.appendChild(el);
        });
    }

    startHosting() {
        if (this.isHosting) return;
        
        this.hostServer = net.createServer((socket) => {
            console.log('Client connected:', socket.remoteAddress);
            if (this.socket) {
                socket.write(JSON.stringify({ type: 'ERROR', msg: 'Game already full' }));
                socket.destroy();
                return;
            }
            this.setupConnection(socket, false);
            this.stopHostingBroadcast(); // Stop advertising once connected
        });

        this.hostServer.on('error', (err) => {
            console.error('Host server error:', err);
            this.isHosting = false;
            document.getElementById('mp-host-btn').innerText = 'HOST GAME';
            if (typeof ui !== 'undefined') ui.popup("OK", ()=>{}, false, null, "HOST ERROR", "Failed to start hosting (port in use?).");
        });
        this.hostServer.listen(this.hostPort, '0.0.0.0', () => {
            console.log('Hosting on port', this.hostPort);
            this.isHosting = true;
            this.startHostingBroadcast();
        });
    }
    
    stopHosting() {
        if (this.hostServer) {
            this.hostServer.close();
            this.hostServer = null;
        }
        this.stopHostingBroadcast();
        if (this.socket) {
            this.socket.destroy();
            this.socket = null;
        }
        this.isHosting = false;
        document.getElementById('mp-host-btn').innerText = 'HOST GAME';
    }

    startHostingBroadcast() {
        if (!this.discoverClient) return; // Need discover client to broadcast
        this.broadcastInterval = setInterval(() => {
            if (!this.discoverClient) return;
            const msg = Buffer.from(JSON.stringify({ type: 'GWENT_HOST', name: this.username }));
            try { this.discoverClient.send(msg, 0, msg.length, this.broadcastPort, '224.0.0.114'); } catch(e) {}
            try { this.discoverClient.send(msg, 0, msg.length, this.broadcastPort, '255.255.255.255'); } catch(e) {}
        }, 1500);
    }

    stopHostingBroadcast() {
        if (this.broadcastInterval) {
            clearInterval(this.broadcastInterval);
            this.broadcastInterval = null;
        }
    }

    joinGame(ip) {
        console.log('Joining', ip);
        const socket = new net.Socket();
        socket.connect(this.hostPort, ip, () => {
            console.log('Connected to', ip);
            this.setupConnection(socket, true);
        });
        socket.on('error', (e) => {
            if (typeof ui !== 'undefined') ui.popup("OK", ()=>{}, false, null, "CONNECTION ERROR", "Failed to connect to host: " + e.message);
        });
    }

    setupConnection(socket, isClient) {
        this.socket = socket;
        this.stopDiscovery();
        
        // Show loading/waiting popup FIRST to prevent race condition where data arrives before popup is created
        ui.popup("CANCEL", () => {
            if (this.socket) { this.socket.destroy(); this.socket = null; }
            this.startDiscovery();
        }, false, null, "CONNECTING", "Establishing connection...");

        this.tcpBuffer = '';
        socket.on('data', (data) => {
            this.tcpBuffer += data.toString();
            let newlineIdx;
            while ((newlineIdx = this.tcpBuffer.indexOf('\n')) > -1) {
                const msgStr = this.tcpBuffer.substring(0, newlineIdx);
                this.tcpBuffer = this.tcpBuffer.substring(newlineIdx + 1);
                this.handleNetworkMessage(msgStr);
            }
        });
        
        socket.on('close', () => {
            console.log('Connection closed');
            this.socket = null;
            if (typeof ui !== 'undefined' && typeof NavigationManager !== 'undefined' && NavigationManager.isScreenActive('game-view')) {
                ui.popup("OK", () => location.reload(), false, null, "DISCONNECTED", "The connection was lost.");
            }
        });

        // Send handshake
        this.send({ type: 'HANDSHAKE', name: this.username });
    }

    send(msgObj) {
        if (this.socket) {
            this.socket.write(JSON.stringify(msgObj) + '\n');
        }
    }

    handleNetworkMessage(msgStr) {
        if (msgStr.trim().length === 0) return;
        try {
            const msg = JSON.parse(msgStr);
                console.log('RECV:', msg);
                
                if (msg.type === 'HANDSHAKE') {
                    if (Popup.curr) Popup.curr.clear(); // Close connecting popup
                    this.opponentName = msg.name;
                    ui.popup("OK", () => {
                        this.startGameWithOpponent();
                    }, false, null, "CONNECTED", "Connected to " + this.opponentName + "! Ready to play?");
                }
        } catch(e) {
            console.error("Failed to parse network message", e);
        }
    }
    
    startGameWithOpponent() {
        // Hide lobby and transition to game view
        NavigationManager.showScreen('game-view');
        
        // As a proof of concept, add a match history record
        this.addHistory(this.opponentName, 'draw');
        
        // We need a major refactor of gwent.js to actually drive gameplay over network.
        // For this step, we just alert the user that gameplay sync is a WIP.
        if (typeof ui !== 'undefined') {
            ui.popup("RETURN TO MENU", () => location.reload(), false, null, "MULTIPLAYER ALPHA", "You have successfully connected via LAN with " + this.opponentName + "!\n\nNote: Full gameplay state synchronization is extremely complex and currently being implemented. For now, the connection is established and the match is recorded.");
        }
    }
}

const mp = new Multiplayer();

function openMultiplayerLobby() { NavigationManager.showScreen('multiplayer-lobby'); mp.openLobby(); }
function closeMultiplayerLobby() { mp.closeLobby(); NavigationManager.showScreen('main-menu'); }

// Init when DOM loads
window.addEventListener('DOMContentLoaded', () => {
    mp.initUI();
});
