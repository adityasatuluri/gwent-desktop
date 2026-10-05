const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/multiplayer.js', 'utf8');

code = code.replace(/this\.stopDiscovery\(\);\s*this\.startDiscovery\(\);/g, `this.stopDiscovery();
				this.discoveredServers = {};
				this.updateServerList();
				this.startDiscovery();`);

fs.writeFileSync('src/renderer/js/multiplayer.js', code);
