const { app, BrowserWindow, ipcMain } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.webContents.on('console-message', (e, level, msg) => console.log('LOG:', msg));
  win.loadFile('src/renderer/index.html');
  win.webContents.executeJavaScript("setTimeout(() => { document.getElementById('menu-tutorial').click(); }, 1000);");
  win.webContents.executeJavaScript("setTimeout(() => { document.querySelector('[data-target=\"tut-video\"]').click(); }, 2000);");
  setTimeout(() => app.quit(), 5000);
});
