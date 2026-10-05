const fs = require('fs');
let html = fs.readFileSync('src/renderer/index.html', 'utf8');

const mpRegex = /<!-- MULTIPLAYER LOBBY -->[\s\S]*?<\/section>/;

const newMp = `<!-- MULTIPLAYER LOBBY -->
	<section id="multiplayer-lobby" class="hide">
		<div class="mp-cinematic-bg"></div>
		<div class="mp-header">
			<img src="assets/img/gwent_logo.png" alt="GWENT" class="mp-logo">
			<h1 class="mp-title">LAN MULTIPLAYER</h1>
		</div>

		<div class="mp-content-wrapper">
			<!-- LEFT COLUMN -->
			<div class="mp-col-left">
				<div class="mp-profile-card">
					<div class="mp-profile-medallion"></div>
					<div class="mp-profile-info">
						<span class="mp-profile-label">PLAYER</span>
						<input type="text" id="mp-username" class="mp-username-input" placeholder="Enter Name..." spellcheck="false" />
					</div>
				</div>

				<div class="mp-actions-menu" id="mp-actions-menu">
					<div class="mp-action-btn active" data-action="host">
						<span class="mp-action-icon host-icon"></span>
						<span class="mp-action-label" id="mp-host-text">HOST A GAME</span>
					</div>
					
					<div class="mp-host-info hide" id="mp-local-ip-container">
						<span class="mp-host-info-label">WAITING FOR OPPONENT ON:</span>
						<span class="mp-host-info-ip" id="mp-local-ip">Checking...</span>
					</div>

					<div class="mp-action-btn" data-action="find">
						<span class="mp-action-icon find-icon"></span>
						<span class="mp-action-label">FIND LOCAL PLAYERS</span>
					</div>
					
					<div class="mp-action-btn" data-action="join">
						<span class="mp-action-icon link-icon"></span>
						<span class="mp-action-label">JOIN BY IP</span>
					</div>

					<div class="mp-join-input-container hide" id="mp-join-ip-container">
						<input type="text" id="mp-direct-ip" class="mp-ip-input" placeholder="e.g. 192.168.1.5" spellcheck="false">
						<button id="mp-direct-connect-btn" class="mp-ip-submit">JOIN</button>
					</div>
				</div>
			</div>

			<!-- RIGHT COLUMN -->
			<div class="mp-col-right">
				<div class="mp-panel">
					<div class="mp-panel-header">
						<span class="mp-panel-icon players-icon"></span>
						<h2>LOCAL PLAYERS</h2>
					</div>
					<div class="mp-panel-content" id="mp-server-list">
						<div class="server-list-empty">SEARCHING FOR PLAYERS...</div>
					</div>
				</div>

				<div class="mp-panel">
					<div class="mp-panel-header">
						<span class="mp-panel-icon swords-icon"></span>
						<h2>RECENT MATCHES</h2>
					</div>
					<div class="mp-panel-content history-list" id="mp-history-list">
					</div>
				</div>
			</div>
		</div>

		<div class="mp-footer">
			<div class="mp-back-btn" id="mp-back-btn" onclick="closeMultiplayerLobby()">
				<span class="mp-back-arrow">&lt;</span>
				<span>BACK TO MENU</span>
			</div>
		</div>
	</section>`;

html = html.replace(mpRegex, newMp);
fs.writeFileSync('src/renderer/index.html', html);
