const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const savedJson = `
class SavedJSON {
	constructor(key, defaultValue) {
		this.key = key;
		let saved = localStorage?.getItem(this.key);
		this.value = saved ? JSON.parse(saved) : defaultValue;
	}
	get() { return this.value; }
	set(val) { this.value = val; localStorage?.setItem(this.key, JSON.stringify(val)); }
}
`;

if (!code.includes('class SavedJSON')) {
    code = code.replace('class Settings\r\n{\r\n', savedJson + 'class Settings\r\n{\r\n');
    code = code.replace('class Settings\n{\n', savedJson + 'class Settings\n{\n');
}

const oldKeysRegex = /\tstatic keyConfirm = new SavedString.*?\n\tstatic keyCancel = new SavedString.*?\n\tstatic keyLeader = new SavedString.*?;/;
const newKeys = `\tstatic controls = new SavedJSON("gc-controls", { selectCard: "Mouse 1", cancelPreview: "Mouse 2", confirmPass: "Enter", pauseMenu: "Escape", leaderAbility: "X" });`;
code = code.replace(oldKeysRegex, newKeys);

fs.writeFileSync('src/renderer/js/gwent.js', code);
