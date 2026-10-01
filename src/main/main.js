const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const settings = require('./settings');

let mainWindow;

function createWindow() {
    const isFullscreen = settings.getSettings().fullscreen;

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        fullscreen: isFullscreen,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // for simplicity with existing code, though better to use preload
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// IPC listeners for settings
ipcMain.on('toggle-fullscreen', (event) => {
    const current = mainWindow.isFullScreen();
    const next = !current;
    mainWindow.setFullScreen(next);
    settings.setFullscreen(next);
});

ipcMain.on('exit-app', () => { app.quit(); });

ipcMain.handle('get-settings', () => settings.getSettings());
ipcMain.on('set-fullscreen', (event, val) => { mainWindow.setFullScreen(val); settings.setFullscreen(val); });

ipcMain.on('log-error', (e, msg) => console.error('RENDERER ERROR:', msg));
