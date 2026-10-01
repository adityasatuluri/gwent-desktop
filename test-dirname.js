const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile('src/renderer/index.html');
  win.webContents.executeJavaScript('console.log(DIRNAME:, typeof __dirname);').catch(e => console.log('ERROR:', e));
  win.webContents.on('console-message', (e, level, msg) => console.log('BROWSER:', msg));
  setTimeout(() => app.quit(), 5000);
});
