const { app, BrowserWindow, ipcMain } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  ipcMain.on('exit-app', () => { console.log('EXIT APP CALLED'); app.quit(); });
  win.webContents.on('console-message', (e, level, msg) => console.log('LOG:', msg));
  win.loadFile('src/renderer/index.html');
  win.webContents.executeJavaScript(
    try {
      require('electron').ipcRenderer.send('exit-app');
    } catch(e) {
      console.log('ERROR:', e.message);
    }
  );
  setTimeout(() => app.quit(), 3000);
});
