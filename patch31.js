const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/multiplayer.js', 'utf8');

// Remove find btn listener
code = code.replace(/const findBtn = document\.querySelector\('\[data-action="find"\]'\);[\s\S]*?this\.startDiscovery\(\);\s*\}\);/g, '');

// Also add listener for refresh btn
code = code.replace(/this\.setupKeyboardNav\(\);/g, `
		const refreshBtn = document.getElementById('mp-refresh-btn');
		if (refreshBtn) {
			refreshBtn.addEventListener('click', () => {
				AudioManager.playSFX('ui_card');
				this.stopDiscovery();
				this.startDiscovery();
			});
		}
		this.setupKeyboardNav();`);

fs.writeFileSync('src/renderer/js/multiplayer.js', code);
