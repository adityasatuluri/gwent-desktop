const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/multiplayer.js', 'utf8');

const oldInitUI = /initUI\(\) \{[\s\S]*?this\.renderHistory\(\);\n    \}/;

const newInitUI = `initUI() {
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

		const hostBtn = document.querySelector('[data-action="host"]');
		const hostText = document.getElementById('mp-host-text');
        hostBtn.addEventListener('click', () => {
			AudioManager.playSFX('ui_card');
            if (this.isHosting) {
                this.stopHosting();
                hostText.innerText = 'HOST A GAME';
                let ipContainer = document.getElementById('mp-local-ip-container');
                if (ipContainer) ipContainer.classList.add('hide');
            } else {
                this.startHosting();
                hostText.innerText = 'CANCEL HOSTING';
                let ipContainer = document.getElementById('mp-local-ip-container');
                if (ipContainer) ipContainer.classList.remove('hide');
            }
        });
		
		const findBtn = document.querySelector('[data-action="find"]');
		findBtn.addEventListener('click', () => {
			AudioManager.playSFX('ui_card');
			this.startDiscovery();
		});

		const joinIpBtn = document.querySelector('[data-action="join"]');
		const joinIpContainer = document.getElementById('mp-join-ip-container');
		joinIpBtn.addEventListener('click', () => {
			AudioManager.playSFX('ui_card');
			if (joinIpContainer.classList.contains('hide')) {
				joinIpContainer.classList.remove('hide');
				ipInput.focus();
			} else {
				joinIpContainer.classList.add('hide');
			}
		});

        this.renderHistory();
		this.setupKeyboardNav();
    }
	
	setupKeyboardNav() {
		this.mpActions = Array.from(document.querySelectorAll('.mp-action-btn'));
		this.mpSelectedIndex = 0;
		this.updateMpSelection();
		
		this.mpActions.forEach((btn, i) => {
			btn.addEventListener('mouseenter', () => {
				this.mpSelectedIndex = i;
				this.updateMpSelection();
			});
		});
		
		this.keydownHandler = (e) => {
			if (document.getElementById('multiplayer-lobby').classList.contains('hide')) return;
			// Don't intercept if typing in username or IP
			if (document.activeElement.tagName === 'INPUT') {
				if (e.key === 'Escape') {
					document.activeElement.blur();
				}
				return;
			}
			
			if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
				e.preventDefault();
				AudioManager.playSFX('ui_hover');
				this.mpSelectedIndex = (this.mpSelectedIndex - 1 + this.mpActions.length) % this.mpActions.length;
				this.updateMpSelection();
			} else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
				e.preventDefault();
				AudioManager.playSFX('ui_hover');
				this.mpSelectedIndex = (this.mpSelectedIndex + 1) % this.mpActions.length;
				this.updateMpSelection();
			} else if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.mpActions[this.mpSelectedIndex].click();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				AudioManager.playSFX('ui_card');
				closeMultiplayerLobby();
			}
		};
		
		document.addEventListener('keydown', this.keydownHandler);
	}
	
	updateMpSelection() {
		this.mpActions.forEach((btn, i) => {
			if (i === this.mpSelectedIndex) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	}
`;

code = code.replace(oldInitUI, newInitUI);
fs.writeFileSync('src/renderer/js/multiplayer.js', code);
