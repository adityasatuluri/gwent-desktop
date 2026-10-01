const { app, BrowserWindow, ipcMain } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  ipcMain.on('exit-app', () => { console.log('EXIT APP CALLED'); app.quit(); });
  win.webContents.on('console-message', (e, level, msg) => console.log('LOG:', msg));
  win.loadFile('src/renderer/index.html');
  win.webContents.executeJavaScript("setTimeout(() => { document.getElementById('menu-exit').click(); }, 1000);");
  win.webContents.executeJavaScript("setTimeout(() => { document.querySelector('#popup button').click(); }, 2000);");
  setTimeout(() => app.quit(), 3500);
});
