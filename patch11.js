const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

code = code.replace("e.stopPropagation();", "e.stopPropagation();\n    e.preventDefault();");
fs.writeFileSync('src/renderer/js/gwent.js', code);
