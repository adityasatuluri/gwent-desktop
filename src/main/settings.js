const Store = require('electron-store');
const store = new Store();

function getSettings() {
    return {
        fullscreen: store.get('fullscreen', true)
    };
}

function setFullscreen(value) {
    store.set('fullscreen', value);
}

module.exports = {
    getSettings,
    setFullscreen,
    store
};
