const fs = require('fs');
let html = fs.readFileSync('src/renderer/index.html', 'utf8');
html = html.replace(/<img src="assets\/img\/gwent_logo\.png" alt="GWENT" class="mp-logo">\r?\n\s*/g, '');
fs.writeFileSync('src/renderer/index.html', html);
