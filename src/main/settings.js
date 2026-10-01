const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

function getSettings() {
    try {
        if (fs.existsSync(settingsPath)) {
            const data = fs.readFileSync(settingsPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Failed to read settings', e);
    }
    return { fullscreen: true }; // Default to true
}

function setFullscreen(value) {
    const current = getSettings();
    current.fullscreen = value;
    try {
        fs.writeFileSync(settingsPath, JSON.stringify(current, null, 2));
    } catch (e) {
        console.error('Failed to write settings', e);
    }
}

module.exports = {
    getSettings,
    setFullscreen
};
