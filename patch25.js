const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/multiplayer.js', 'utf8');

code = code.replace(
    /document\.getElementById\('mp-host-text'\)\.innerText = 'HOST GAME';/g,
    "document.getElementById('mp-host-text').innerText = 'HOST A GAME';\n        let ipc = document.getElementById('mp-local-ip-container');\n        if (ipc) ipc.classList.add('hide');"
);

fs.writeFileSync('src/renderer/js/multiplayer.js', code);
