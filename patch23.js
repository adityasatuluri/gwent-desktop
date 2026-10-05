const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/multiplayer.js', 'utf8');
code = code.replace(/document\.getElementById\('mp-host-btn'\)\.innerText/g, "document.getElementById('mp-host-text').innerText");
fs.writeFileSync('src/renderer/js/multiplayer.js', code);
