const fs = require('fs');
let html = fs.readFileSync('src/renderer/index.html', 'utf8');

const refreshSvg = `<svg class="mp-icon-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.5l5.67-5.67"/></svg>`;
const editSvg = `<svg class="mp-icon-svg" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>`;
const cameraSvg = `<svg class="mp-icon-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;

// Replace refresh button
html = html.replace(/<span class="mp-refresh-btn" id="mp-refresh-btn" title="Refresh">?<\/span>/g, 
	`<span class="mp-refresh-btn" id="mp-refresh-btn" title="Refresh">${refreshSvg}</span>`);

// Modify profile card
const oldProfile = `<div class="mp-profile-card">
					<div class="mp-profile-medallion"></div>
					<div class="mp-profile-info">
						<span class="mp-profile-label">PLAYER</span>
						<input type="text" id="mp-username" class="mp-username-input" placeholder="Enter Name..." spellcheck="false" />
					</div>
				</div>`;

const newProfile = `<div class="mp-profile-card">
					<div class="mp-profile-medallion" id="mp-avatar" title="Change Avatar">
						<div class="mp-avatar-edit-overlay">${cameraSvg}</div>
					</div>
					<input type="file" id="mp-avatar-upload" accept="image/*" style="display:none;">
					<div class="mp-profile-info">
						<span class="mp-profile-label">PLAYER</span>
						<div style="display:flex; align-items:center; width:100%;">
							<input type="text" id="mp-username" class="mp-username-input" placeholder="Enter Name..." spellcheck="false" readonly />
							<span id="mp-edit-name-btn" title="Edit Name" style="cursor:pointer; color:#888; margin-left:0.5vw; transition:color 0.2s;">${editSvg}</span>
						</div>
					</div>
				</div>`;

html = html.replace(oldProfile, newProfile);
fs.writeFileSync('src/renderer/index.html', html);
