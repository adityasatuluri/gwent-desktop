const fs = require('fs');
let html = fs.readFileSync('src/renderer/index.html', 'utf8');

// 1. Remove "FIND LOCAL PLAYERS" button
html = html.replace(/<div class="mp-action-btn" data-action="find">[\s\S]*?<\/div>\s*/g, '');

// 2. Add Refresh button to Local Players
html = html.replace(/(<h2>LOCAL PLAYERS<\/h2>)/g, '$1\n\t\t\t\t\t\t<span class="mp-refresh-btn" id="mp-refresh-btn" title="Refresh">?</span>');

// 3. Move Back to Menu button to left column.
// First remove it from footer
html = html.replace(/<div class="mp-footer">[\s\S]*?<\/div>\s*<\/section>/, '</section>');

// Then add it to mp-actions-menu
const backBtnHtml = `
					<div class="mp-action-btn" id="mp-back-btn" onclick="closeMultiplayerLobby()">
						<span class="mp-action-icon">&lt;</span>
						<span class="mp-action-label">BACK TO MENU</span>
					</div>
				</div>`;
html = html.replace(/<\/div>\s*<!-- RIGHT COLUMN -->/g, backBtnHtml + '\n\t\t\t<!-- RIGHT COLUMN -->');

fs.writeFileSync('src/renderer/index.html', html);
