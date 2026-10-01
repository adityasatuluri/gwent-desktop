const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile('src/renderer/index.html');
  win.webContents.on('console-message', (e, level, msg, line) => console.log('BROWSER:', msg, 'at line', line));
  win.webContents.executeJavaScript("setTimeout(() => { console.log('Testing game start...'); mp.socket = {}; mp.isHosting = true; mp.opponentName = 'FakeOpponent'; mp.opponentDeck = { faction: 'monsters', leader: 'monsters_leader1', cards: [{index: 1, count: 2}] }; mp.myDeck = { faction: 'northern_realm', leader: 'northern_leader1', cards: [{index: 1, count: 2}] }; player_me = new Player(0, 'Player1', mp.myDeck); mp.checkDecksReady(); }, 1500);");
});
