const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });
  win.loadFile('src/renderer/index.html');
  win.webContents.on('console-message', (e, level, msg, line) => console.log('BROWSER:', msg, 'at line', line));
  win.webContents.executeJavaScript("setTimeout(() => { mp.isHosting = true; mp.socket = { write: (msg) => console.log('SOCKET SEND:', msg.substring(0, 50)) }; mp.username = 'TestHost'; mp.opponentName = 'TestClient'; document.getElementById('multiplayer-lobby').classList.add('hide'); document.getElementById('main-menu').classList.add('hide'); NavigationManager.showScreen('deck-customization'); dm.state = 2; dm.stats.units = 25; dm.stats.special = 5; dm.deck.push({index: 4, count: 25}); console.log('Calling dm.startNewGame()...'); dm.startNewGame(); setTimeout(() => { const opDeck = { faction: 'monsters', leader: card_dict[0], cards: [{index: 5, count: 25}] }; mp.handleNetworkMessage(JSON.stringify({ type: 'DECK_READY', deck: opDeck })); setTimeout(() => { console.log('CHECKING STATUS:', !!mp.myDeck, !!mp.opponentDeck, !!Popup.curr); }, 1000); }, 500); }, 3000);");
});
