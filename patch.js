const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

// Replace standard e.key checks with the mapped settings. We allow the original keys as fallback to prevent getting stuck in menus.
code = code.replace(/e\.key === 'Escape'/g, "(e.key === 'Escape' || e.key.toLowerCase() === Settings.keyCancel.get().toLowerCase())");
code = code.replace(/e\.key === 'Enter'/g, "(e.key === 'Enter' || e.key.toLowerCase() === Settings.keyConfirm.get().toLowerCase())");
code = code.replace(/e\.key === 'x' \|\| e\.key === 'X'/g, "(e.key.toLowerCase() === Settings.keyLeader.get().toLowerCase())");

fs.writeFileSync('src/renderer/js/gwent.js', code);
