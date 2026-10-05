const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

// Add SavedJSON
if (!code.includes('class SavedJSON')) {
    code = code.replace('class SavedDeck', class SavedJSON {
\tconstructor(key, defaultValue) {
\t\tthis.key = key;
\t\tlet saved = localStorage?.getItem(this.key);
\t\tthis.value = saved ? JSON.parse(saved) : defaultValue;
\t}
\tget() { return this.value; }
\tset(val) { this.value = val; localStorage?.setItem(this.key, JSON.stringify(val)); }
}
class SavedDeck);
}

// Replace Settings variables
code = code.replace(/\tstatic keyConfirm = new SavedString.*?\n\tstatic keyCancel = new SavedString.*?\n\tstatic keyLeader = new SavedString.*?;/, 
\tstatic controls = new SavedJSON("gc-controls", { selectCard: 'Mouse 1', cancelPreview: 'Mouse 2', confirmPass: 'Enter', pauseMenu: 'Escape', leaderAbility: 'X' }););

fs.writeFileSync('src/renderer/js/gwent.js', code);
