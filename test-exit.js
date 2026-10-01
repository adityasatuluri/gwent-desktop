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
      try {
        console.log('Clicking TUTORIAL button...');
        document.getElementById('menu-tutorial').click();
      } catch(e) { console.error('TUT error', e); }
    }, 1000);
    setTimeout(() => {
      try {
        console.log('Clicking EXIT button...');
        document.getElementById('menu-exit').click();
      } catch(e) { console.error('EXIT error', e); }
    }, 2000);
    setTimeout(() => {
      try {
        console.log('Clicking YES on popup...');
        const yesBtn = document.querySelector('.yes-no > div:first-child') || document.querySelector('#popup button');
        if (yesBtn) yesBtn.click();
        else console.log('YES button not found');
      } catch(e) { console.error('YES error', e); }
    }, 3000);
  );
  setTimeout(() => app.quit(), 5000);
});
