const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

code = code.replace(/Settings\.keyConfirm\.get\(\)/g, "Settings.controls.get().confirmPass");
code = code.replace(/Settings\.keyCancel\.get\(\)/g, "Settings.controls.get().pauseMenu");
code = code.replace(/Settings\.keyLeader\.get\(\)/g, "Settings.controls.get().leaderAbility");

fs.writeFileSync('src/renderer/js/gwent.js', code);
