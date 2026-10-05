const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/multiplayer.js', 'utf8');

const newLogic = `
		// Avatar logic
		const avatarDiv = document.getElementById('mp-avatar');
		const avatarUpload = document.getElementById('mp-avatar-upload');
		const savedAvatar = localStorage.getItem('gwent_mp_avatar');
		if (savedAvatar) {
			avatarDiv.style.backgroundImage = 'url(' + savedAvatar + ')';
		}
		
		if (avatarDiv && avatarUpload) {
			avatarDiv.addEventListener('click', () => {
				avatarUpload.click();
			});
			avatarUpload.addEventListener('change', (e) => {
				const file = e.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = (ev) => {
						const dataUrl = ev.target.result;
						localStorage.setItem('gwent_mp_avatar', dataUrl);
						avatarDiv.style.backgroundImage = 'url(' + dataUrl + ')';
					};
					reader.readAsDataURL(file);
				}
			});
		}

		// Edit Name logic
		const nameInput = document.getElementById('mp-username');
		const editNameBtn = document.getElementById('mp-edit-name-btn');
		if (nameInput && editNameBtn) {
			editNameBtn.addEventListener('click', () => {
				nameInput.removeAttribute('readonly');
				nameInput.focus();
			});
			nameInput.addEventListener('blur', () => {
				nameInput.setAttribute('readonly', 'true');
			});
			nameInput.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') nameInput.blur();
			});
		}
`;

code = code.replace(/document\.getElementById\('mp-username'\)\.addEventListener\('input', \(e\) => \{[\s\S]*?\}\);/g, `document.getElementById('mp-username').addEventListener('input', (e) => {
            this.username = e.target.value;
            localStorage.setItem('gwent_mp_username', this.username);
        });` + newLogic);

fs.writeFileSync('src/renderer/js/multiplayer.js', code);
