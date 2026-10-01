const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile('src/renderer/index.html');
  win.webContents.on('console-message', (e, level, msg, line) => console.log('BROWSER:', msg, 'at line', line));
  win.webContents.executeJavaScript("setTimeout(() => { console.log('Testing game start...'); mp.socket = { write: (d)=>console.log('socket write', d) }; mp.isHosting = true; mp.opponentName = 'FakeOpponent'; const leaderCard = card_dict.find(c => c.row === 'leader' && c.deck === 'monsters'); mp.opponentDeck = { faction: 'monsters', leader: leaderCard, cards: [{index: 1, count: 2}] }; mp.myDeck = { faction: 'monsters', leader: leaderCard, cards: [{index: 1, count: 2}] }; mp.checkDecksReady(); }, 1500);");
});
