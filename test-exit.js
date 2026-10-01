const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  ipcMain.on('exit-app', () => { console.log('[IPC] exit-app received'); app.quit(); });
  win.webContents.on('console-message', (event, level, message) => {
    console.log('[BROWSER CONSOLE]', message);
  });
  win.loadFile('src/renderer/index.html');
  win.webContents.executeJavaScript(
    setTimeout(() => {
      console.log('Clicking EXIT button...');
      document.getElementById('menu-exit').click();
    }, 1000);
    setTimeout(() => {
      console.log('Clicking YES on popup...');
      const yesBtn = document.querySelector('.yes-no > div:first-child');
      if (yesBtn) yesBtn.click();
      else console.log('YES button not found');
    }, 2000);
  );
  setTimeout(() => app.quit(), 4000);
});
