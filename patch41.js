const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

const startIndex = css.indexOf('/* ---- MULTIPLAYER LOBBY (AAA REDESIGN) ---- */');
let endIndex = css.indexOf('/* ===== NATIVE GWENT POPUP ===== */');
if (endIndex === -1) {
    endIndex = css.indexOf('/* --------------------- end screen ---------------------------  */');
}
if (endIndex === -1) {
    endIndex = css.indexOf('/* ===== INTRO SCREEN ===== */');
}

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
	background: url('../assets/img/multiplayer_bg.png') center/cover no-repeat;
	opacity: 0.15;
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
	width: 15vw !important;
	max-width: 300px;
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
	background: rgba(0,0,0,0.5) url('../assets/img/ui/wolf_medallion.png') center/cover no-repeat;
	border-right: 1px solid rgba(182,139,68,0.3);
	position: relative;
	cursor: pointer;
}
.mp-avatar-edit-overlay {
	position: absolute;
	top: 0; left: 0; width: 100%; height: 100%;
	background: rgba(0,0,0,0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	opacity: 0;
	transition: opacity 0.2s;
}
.mp-profile-medallion:hover .mp-avatar-edit-overlay {
	opacity: 1;
}
.mp-icon-svg {
	display: block;
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
	border-bottom: 1px solid transparent;
	color: #e5cd85;
	font-family: 'Cinzel', serif;
	font-size: 1.5vw;
	outline: none;
	letter-spacing: 0.05em;
	width: 100%;
	text-shadow: 0 2px 4px black;
}
.mp-username-input:not([readonly]) {
	border-bottom: 1px solid #b68b44;
	background: rgba(0,0,0,0.3);
}
.mp-username-input::placeholder { color: #555; }
#mp-edit-name-btn:hover {
	color: #e5cd85 !important;
}

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
	flex: 0 0 auto;
	min-height: 25vh;
	max-height: 45vh;
}
.mp-panel-header {
	display: flex;
	align-items: center;
	padding: 1vw;
	border-bottom: 1px solid rgba(182,139,68,0.2);
	background: rgba(0,0,0,0.5);
}

.mp-refresh-btn {
	margin-left: auto;
	color: #b68b44;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
}
.mp-refresh-btn:hover {
	color: #e5cd85;
}
.mp-refresh-btn svg {
	transition: transform 0.2s;
}
.mp-refresh-btn:hover svg {
	transform: rotate(90deg);
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
`;
    
if (startIndex !== -1 && endIndex !== -1) {
    css = css.substring(0, startIndex) + newMpCss + '\n\n' + css.substring(endIndex);
    fs.writeFileSync('src/renderer/css/style.css', css);
    console.log("Success");
} else {
    console.log("Failed to find bounds", startIndex, endIndex);
}
