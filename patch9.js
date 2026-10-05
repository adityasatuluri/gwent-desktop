const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

code = code.replace("document.addEventListener('keydown', (e) => {", "document.addEventListener('keydown', (e) => {\n    let kName = formatInputName(e.key);\n    if (handleGameplayInput(kName)) { e.preventDefault(); return; }");

fs.writeFileSync('src/renderer/js/gwent.js', code);
