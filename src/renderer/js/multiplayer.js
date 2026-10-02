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

        const joinBtn = document.getElementById('mp-direct-connect-btn');
        const ipInput = document.getElementById('mp-direct-ip');
        
        const handleJoin = () => {
            let ip = ipInput?.value.trim();
            if (ip) {
                ip = ip.split(',')[0].trim();
                AudioManager.playSFX('ui_card');
                this.joinGame(ip);
            }
        };

        joinBtn?.addEventListener('click', handleJoin);
        ipInput?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleJoin();
        });

        document.getElementById('mp-host-btn').addEventListener('click', () => {
            if (this.isHosting) {
                this.stopHosting();
                document.getElementById('mp-host-btn').innerText = 'HOST GAME';
                let ipContainer = document.getElementById('mp-local-ip-container');
                if (ipContainer) ipContainer.style.display = 'none';
            } else {
                this.startHosting();
                document.getElementById('mp-host-btn').innerText = 'CANCEL HOSTING';
                let ipContainer = document.getElementById('mp-local-ip-container');
                if (ipContainer) ipContainer.style.display = 'block';
            }
        });

        this.renderHistory();
    }

    openLobby() {
        document.getElementById('multiplayer-lobby').classList.remove('hide');
        this.startDiscovery();

        try {
            const os = require('os');
            const interfaces = os.networkInterfaces();
            let addresses = [];
            for (let k in interfaces) {
                for (let k2 in interfaces[k]) {
                    let address = interfaces[k][k2];
                    if (address.family === 'IPv4' && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }
            let ipElem = document.getElementById('mp-local-ip');
            if (ipElem) ipElem.innerHTML = addresses.length > 0 ? addresses.join('<br>') : '127.0.0.1';
        } catch(e) {
            let ipElem = document.getElementById('mp-local-ip');
            if (ipElem) ipElem.innerText = 'Unknown';
        }
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
        
        try {
            const os = require('os');
            const interfaces = os.networkInterfaces();
            let addresses = [];
            for (let k in interfaces) {
                for (let k2 in interfaces[k]) {
                    let address = interfaces[k][k2];
                    if (address.family === 'IPv4' && !address.internal) {
                        addresses.push(address.address);
                    }
                }
            }
            let ipElem = document.getElementById('mp-local-ip');
            if (ipElem) ipElem.innerHTML = addresses.length > 0 ? addresses.join('<br>') : '127.0.0.1';
        } catch(e) {
            let ipElem = document.getElementById('mp-local-ip');
            if (ipElem) ipElem.innerText = 'Unknown';
        }

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
        
        if (typeof ui !== 'undefined') ui.popup("CANCEL", () => {
            socket.destroy();
        }, false, null, "CONNECTING", "Establishing connection to " + ip + "...");
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

    async handleNetworkMessage(msgStr) {
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
                } else if (msg.type === 'DECK_READY') {
                    this.opponentDeck = msg.deck;
                    if (!this.myDeck) {
                        let el = document.getElementById('mp-wait-status');
                        if (!el) {
                            el = document.createElement('div');
                            el.id = 'mp-wait-status';
                            el.style = 'position:absolute;top:20px;right:20px;color:white;font-size:18px;background:rgba(0,0,0,0.8);padding:15px;z-index:9999;border:2px solid #b78a3d;border-radius:10px;text-transform:uppercase;';
                            document.body.appendChild(el);
                        }
                        el.innerHTML = this.opponentName + " has finished their deck and is waiting for you!";
                    }
                    this.checkDecksReady();
                } else if (msg.type === 'START_GAME_SYNC') {
                    this.sharedSeed = msg.seed;
                    this.beginSyncedGame();
                } else if (msg.type === 'MOVE_TO') {
                    if (Popup.curr && Popup.curr.title === "OPPONENT'S TURN") Popup.curr.clear();
                    
                    const getRef = (ref) => {
                        if (ref === "hand-me") return player_op.hand;
                        if (ref === "deck-me") return player_op.deck;
                        if (ref === "grave-me") return player_op.grave;
                        if (ref === "hand-op") return player_me.hand;
                        if (ref === "deck-op") return player_me.deck;
                        if (ref === "grave-op") return player_me.grave;
                        if (ref === "weather") return weather;
                        if (ref.startsWith("row-")) {
                            let idx = parseInt(ref.split('-')[1]);
                            // Opponent's row 0 is our row 5
												idx = 5 - idx;

                            return board.row[idx];
                        }
                        if (ref === "grave" || ref === "deck" || ref === "hand") return ref;
                        return null;
                    };
                    
                    const source = getRef(msg.sourceRef);
                    const row = getRef(msg.rowRef);
                    
                    if (source && source.cards) {
                        const card = source.cards[msg.sourceIdx];
                        if (card && row) {
                            await board.moveTo(card, row, source);
                            card.holder.endTurn();
                        }
                    }
                } else if (msg.type === 'PASS_ROUND') {
                    if (Popup.curr && Popup.curr.title === "OPPONENT'S TURN") Popup.curr.clear();
                    player_op.passRound();
                } else if (msg.type === 'LEADER_PLAYED') {
                    if (Popup.curr && Popup.curr.title === "OPPONENT'S TURN") Popup.curr.clear();
                    player_op.activateLeader();
                } else if (msg.type === 'REDRAW_SYNC') {
                    // Replace opponent's hand and deck with the synced state
                    const replaceCards = async (container, indices) => {
                        container.cards = [];
                        if (container.elem) {
                            if (container === player_op.deck) {
                                while(container.elem.children.length > 1) {
                                    container.elem.firstChild.remove();
                                }
                            } else {
                                while(container.elem.firstChild) {
                                    container.elem.firstChild.remove();
                                }
                            }
                        }
                        
                        for (let idx of indices) {
                            let c = new Card(card_dict[idx], player_op);
                            if (container === player_op.deck) {
                                container.cards.push(c);
                                if (container.elem) container.addCardElement();
                            } else {
                                if (container.elem) await container.addCard(c);
                                else container.cards.push(c);
                            }
                        }
                        
                        if (container === player_op.deck && container.elem) {
                            container.counter.innerHTML = container.cards.length;
                        }
                    };
                    
                    await replaceCards(player_op.hand, msg.hand);
                    await replaceCards(player_op.deck, msg.deck);
                    
                    this.opponentRedrawSynced = true;
                }
        } catch(e) {
            console.error("Failed to parse network message", e);
        }
    }
    
    startGameWithOpponent() {
        // Transition to deck customization instead of directly to game!
        document.body.classList.add('in-game');
        NavigationManager.showScreen('deck-customization');
        if (typeof dm !== 'undefined') {
            dm.state = GameState.CUSTOMIZE; // Assuming dm is global DeckMaker
        }
    }

    sendDeck(deckData) {
        this.myDeck = deckData;
        this.send({ type: 'DECK_READY', deck: deckData });
        this.checkDecksReady();
    }

    checkDecksReady() {
        if (this.myDeck && this.opponentDeck) {
            if (Popup.curr) Popup.curr.clear(); // Close 'Waiting for opponent'
            let el = document.getElementById('mp-wait-status');
            if (el) el.remove();
            
            // If I am the host, I generate the RNG seeds
            if (this.isHosting) {
                this.sharedSeed = Math.floor(Math.random() * 1000000);
                this.send({ type: 'START_GAME_SYNC', seed: this.sharedSeed });
                this.beginSyncedGame();
            }
        }
    }

    beginSyncedGame() {
        console.log("DEBUG: beginSyncedGame called!");
        Math.seed = this.sharedSeed; // Ensure RNG is synced for deck shuffle
        this.isGameActive = true;
        
        // Initialize BOTH players properly now that the seed is synced
        player_me = new Player(0, this.username || "Player 1", this.myDeck);
        player_op = new Player(1, this.opponentName, this.opponentDeck);
        
        NavigationManager.showScreen('game-view');
        // Override Math.random for deterministic shuffling? No, we will just sync the shuffled arrays, 
        // but since we are modifying things, it's easier to just shuffle locally and send the array, 
        // OR implement a tiny seeded RNG.
        
        // Setup Network Controller for player_op
        player_op.controller = new NetworkController(player_op);
        
        // Setup Network Hooks for player_me
        this.setupNetworkHooks();
        
        game.startGame();
    }

    setupNetworkHooks() {
        // Intercept player_me actions
        const ogMoveTo = board.moveTo;
        board.moveTo = async (card, row, source) => {
            const isHumanMove = (source === player_me.hand || source === player_me.grave || row === player_me.hand);
            if (card.holder === player_me && this.isGameActive && game.state === GameState.PLAY && isHumanMove) {
                // Determine card index in source to sync accurately
                const sourceIdx = source.cards.indexOf(card);
                
                let sourceRef = "";
                if (source === player_me.hand) sourceRef = "hand-me";
                else if (source === player_me.deck) sourceRef = "deck-me";
                else if (source === player_me.grave) sourceRef = "grave-me";
                else if (source === player_op.hand) sourceRef = "hand-op";
                else if (source === player_op.deck) sourceRef = "deck-op";
                else if (source === player_op.grave) sourceRef = "grave-op";
                else if (source === weather) sourceRef = "weather";
                else if (board.row.includes(source)) sourceRef = "row-" + board.row.indexOf(source);
                else sourceRef = "unknown";
                
                let rowRef = "";
                if (row === "grave" || row === "deck" || row === "hand") rowRef = row;
                else if (row === weather) rowRef = "weather";
                else if (board.row.includes(row)) rowRef = "row-" + board.row.indexOf(row);
                else rowRef = "unknown";
                
                this.send({ type: 'MOVE_TO', sourceRef: sourceRef, sourceIdx: sourceIdx, rowRef: rowRef });
            }
            return await ogMoveTo.call(board, card, row, source);
        };
        
        const ogPass = player_me.passRound;
        player_me.passRound = async () => {
            if (this.isGameActive) this.send({ type: 'PASS_ROUND' });
            return await ogPass.call(player_me);
        };
        
        const ogEndTurn = player_me.endTurn;
        player_me.endTurn = () => {
            if (this.isGameActive) this.send({ type: 'END_TURN' });
            return ogEndTurn.call(player_me);
        };
        
        const ogActivateLeader = player_me.activateLeader;
        player_me.activateLeader = async () => {
            if (this.isGameActive) this.send({ type: 'LEADER_PLAYED' });
            return await ogActivateLeader.call(player_me);
        };
        
        const ogInitialRedraw = game.initialRedraw;
        game.initialRedraw = async () => {
            await ogInitialRedraw.call(game);
            
            if (this.isGameActive) {
                // Send our finalized hand and deck state
                const handIndices = player_me.hand.cards.map(c => {
                    const idx = card_dict.findIndex(cd => cd.name === c.name && cd.filename === c.filename && cd.deck === c.faction && (cd.row === c.row || (cd.deck === 'weather' && c.row === 'weather')));
                    if (idx === -1) console.error("Could not find card in dictionary:", c);
                    return idx;
                });
                const deckIndices = player_me.deck.cards.map(c => {
                    const idx = card_dict.findIndex(cd => cd.name === c.name && cd.filename === c.filename && cd.deck === c.faction && (cd.row === c.row || (cd.deck === 'weather' && c.row === 'weather')));
                    if (idx === -1) console.error("Could not find card in dictionary:", c);
                    return idx;
                });
                console.log("Sending REDRAW_SYNC", { handIndices, deckIndices });
                this.send({ type: 'REDRAW_SYNC', hand: handIndices, deck: deckIndices });
                
                // Wait for opponent's redraw sync
                ui.popup("HIDDEN", null, null, null, "WAITING FOR OPPONENT", "Waiting for opponent to finish their mulligan...");
                await sleepUntil(() => this.opponentRedrawSynced);
                if (Popup.curr && Popup.curr.title === "WAITING FOR OPPONENT") Popup.curr.clear();
				Math.seed = this.sharedSeed + 42; // Force resync seed after mulligan divergent RNG
            }
        };
    }
}

const mp = new Multiplayer();

function openMultiplayerLobby() { NavigationManager.showScreen('multiplayer-lobby'); mp.openLobby(); }
function closeMultiplayerLobby() { mp.closeLobby(); NavigationManager.showScreen('main-menu'); }

// Init when DOM loads
window.addEventListener('DOMContentLoaded', () => {
    mp.initUI();
});
