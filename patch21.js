const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

const mpCssRegex = /\/\* ---- MULTIPLAYER LOBBY ---- \*\/[\s\S]*?(?=\/\* ===== NATIVE GWENT POPUP ===== \*\/|\/\* --------------------- end screen ---------------------------  \*\/)/;

const newMpCss = `/* ---- MULTIPLAYER LOBBY (AAA REDESIGN) ---- */
#multiplayer-lobby {
	position: absolute;
	width: 100vw;
	height: calc(100vw * 1080 / 1920);
	background: #050505; /* Deep black base */
	z-index: 10000;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #e5cd85;
	font-family: 'Cinzel', 'Palatino Linotype', serif;
	overflow: hidden;
}
#multiplayer-lobby.hide { display: none !important; }

.mp-cinematic-bg {
	position: absolute;
	top: 0; left: 0; width: 100%; height: 100%;
	background: url('../assets/img/ui/main_bg.jpg') center/cover no-repeat;
	opacity: 0.4; /* Dim background for contrast */
	z-index: -2;
}
.mp-vignette {
	position: absolute;
	top: 0; left: 0; width: 100%; height: 100%;
	background: radial-gradient(circle, transparent 20%, #000 90%);
	z-index: -1;
}

.mp-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 3vw;
	width: 80%;
}
.mp-logo {
	width: 10vw;
	filter: drop-shadow(0 0 1vw #b68b44);
	margin-bottom: 0.5vw;
}
.mp-title {
	font-size: 2vw;
	letter-spacing: 0.2em;
	color: #e5cd85;
	text-shadow: 0 0.2vw 0.5vw black;
}
.mp-divider {
	width: 100%;
	height: 1px;
	background: linear-gradient(90deg, transparent, rgba(182,139,68,0.5), transparent);
	margin-top: 1vw;
}

.mp-content-wrapper {
	display: flex;
	width: 85%;
	max-width: 1600px;
	margin-top: 2vw;
	gap: 4vw;
	flex: 1;
}

/* LEFT COLUMN */
.mp-col-left {
	flex: 0 0 35%;
	display: flex;
	flex-direction: column;
	gap: 2vw;
}

/* PROFILE CARD */
.mp-profile-card {
	display: flex;
	background: rgba(15,15,15,0.8);
	border: 1px solid rgba(182,139,68,0.4);
	box-shadow: 0 0.5vw 1vw rgba(0,0,0,0.8);
	position: relative;
	overflow: hidden;
}
.mp-profile-card::before {
	content: ''; position: absolute; top:0; left:0; width: 100%; height: 100%;
	background: linear-gradient(90deg, rgba(255,255,255,0.03), transparent);
	pointer-events: none;
}
.mp-profile-medallion {
	width: 6vw;
	height: 6vw;
	background: rgba(0,0,0,0.5) url('../assets/img/ui/wolf_medallion.png') center/contain no-repeat;
	border-right: 1px solid rgba(182,139,68,0.3);
}
.mp-profile-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 0 1.5vw;
	flex: 1;
}
.mp-profile-label {
	font-size: 0.8vw;
	color: #888;
	letter-spacing: 0.1em;
}
.mp-username-input {
	background: transparent;
	border: none;
	color: #e5cd85;
	font-family: 'Cinzel', serif;
	font-size: 1.5vw;
	outline: none;
	letter-spacing: 0.05em;
	width: 100%;
	text-shadow: 0 2px 4px black;
}
.mp-username-input::placeholder { color: #555; }

/* ACTIONS MENU */
.mp-actions-menu {
	display: flex;
	flex-direction: column;
	gap: 0.5vw;
}
.mp-action-btn {
	display: flex;
	align-items: center;
	padding: 1vw 1.5vw;
	background: rgba(20,20,20,0.6);
	border: 1px solid rgba(100,100,100,0.2);
	cursor: pointer;
	transition: all 0.2s;
	position: relative;
}
.mp-action-btn:hover {
	background: rgba(40,40,40,0.7);
	border-color: rgba(182,139,68,0.4);
}
.mp-action-btn.active {
	background: rgba(30,30,30,0.9);
	border-color: #b68b44;
	box-shadow: 0 0 1vw rgba(182,139,68,0.2);
}
.mp-action-btn.active .mp-action-label {
	color: #e5cd85;
}
.mp-action-label {
	font-size: 1.2vw;
	color: #aaa;
	letter-spacing: 0.1em;
	transition: color 0.2s;
}

.mp-host-info {
	padding: 1vw 1.5vw;
	background: rgba(10,10,10,0.8);
	border-left: 2px solid #b68b44;
	display: flex;
	flex-direction: column;
	gap: 0.3vw;
}
.mp-host-info-label { font-size: 0.8vw; color: #888; }
.mp-host-info-ip { font-size: 1.2vw; color: #fff; letter-spacing: 0.1em; }

.mp-join-input-container {
	display: flex;
	padding: 1vw 1.5vw;
	background: rgba(10,10,10,0.8);
	border-left: 2px solid #b68b44;
	gap: 1vw;
}
.mp-ip-input {
	flex: 1;
	background: rgba(0,0,0,0.5);
	border: 1px solid #444;
	color: #fff;
	padding: 0.5vw;
	font-family: 'Cinzel', serif;
	font-size: 1vw;
}
.mp-ip-submit {
	background: #222;
	border: 1px solid #b68b44;
	color: #e5cd85;
	font-family: 'Cinzel', serif;
	cursor: pointer;
	padding: 0 1vw;
}
.mp-ip-submit:hover { background: #333; }

/* RIGHT COLUMN */
.mp-col-right {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 2vw;
}
.mp-panel {
	background: rgba(15,15,15,0.7);
	border: 1px solid rgba(182,139,68,0.3);
	display: flex;
	flex-direction: column;
	flex: 1;
}
.mp-panel-header {
	display: flex;
	align-items: center;
	padding: 1vw;
	border-bottom: 1px solid rgba(182,139,68,0.2);
	background: rgba(0,0,0,0.5);
}
.mp-panel-header h2 {
	font-size: 1.2vw;
	color: #ddd;
	letter-spacing: 0.1em;
	margin: 0;
}
.mp-panel-content {
	flex: 1;
	padding: 1vw;
	overflow-y: auto;
}

.server-list-empty {
	text-align: center;
	color: #666;
	font-size: 1vw;
	font-style: italic;
	margin-top: 2vw;
}

.mp-list-item, .history-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1vw;
	background: rgba(255,255,255,0.02);
	border: 1px solid rgba(255,255,255,0.05);
	margin-bottom: 0.5vw;
	transition: background 0.2s;
}
.mp-list-item:hover, .history-item:hover {
	background: rgba(255,255,255,0.05);
	border-color: rgba(182,139,68,0.3);
}
.mp-list-item .player-name {
	font-size: 1.2vw;
	color: #ddd;
}
.join-btn {
	background: transparent;
	border: 1px solid #b68b44;
	color: #b68b44;
	padding: 0.3vw 1vw;
	cursor: pointer;
	font-family: 'Cinzel', serif;
}
.join-btn:hover {
	background: rgba(182,139,68,0.2);
}

.history-item.VICTORY { border-left: 3px solid #4CAF50; }
.history-item.DEFEAT { border-left: 3px solid #F44336; }
.history-item.DRAW { border-left: 3px solid #FFC107; }

/* BOTTOM NAV */
.mp-footer {
	position: absolute;
	bottom: 3vw;
	width: 100%;
	display: flex;
	justify-content: center;
}
.mp-back-btn {
	display: flex;
	align-items: center;
	gap: 0.5vw;
	padding: 0.5vw 2vw;
	border: 1px solid rgba(182,139,68,0.5);
	color: #e5cd85;
	background: rgba(10,10,10,0.8);
	cursor: pointer;
	font-size: 1vw;
	letter-spacing: 0.1em;
	transition: all 0.2s;
}
.mp-back-btn:hover {
	background: rgba(30,30,30,0.9);
	border-color: #b68b44;
	box-shadow: 0 0 1vw rgba(182,139,68,0.2);
}

`;

css = css.replace(mpCssRegex, newMpCss);
fs.writeFileSync('src/renderer/css/style.css', css);
