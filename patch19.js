const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const popupRegex = /class Popup \{[\s\S]*?\n\}/;

const newPopupClass = `class Popup {
	constructor(yesName, yes, noName, no, header, description, alpha = 0.75){
		this.yes = yes ? yes : ()=>{};
		this.no = no ? no : ()=>{};
		
		this.elem = document.getElementById("popup");
		
		let main = this.elem.querySelector('.popup-box');
		main.querySelector('.popup-header').innerHTML = header ? header : "";
		main.querySelector('.popup-description').innerHTML = description ? description : "";
		
		this.btnYes = document.getElementById('popup-btn-yes');
		this.btnNo = document.getElementById('popup-btn-no');
		
		this.btnYes.innerHTML = (yesName) ? yesName : "Yes";
		
		this.hasNoBtn = !!noName;
		if (this.hasNoBtn) {
			this.btnNo.innerHTML = noName;
			this.btnNo.style.display = 'block';
		} else {
			this.btnNo.style.display = 'none';
		}

		this.elem.style.backgroundColor = 'rgba(10, 10, 10, ' + alpha + ')';
		
		this.elem.classList.remove("hide");
		Popup.setCurrent(this);
		
		let mainEl = document.getElementsByTagName("main")[0];
		this.wasPlayerEnabled = !mainEl.classList.contains("noclick");
		ui.enablePlayer(false);
		
		this.selectedIndex = 0; // 0 for Yes, 1 for No
		this.updateSelection();
		
		this.btnYes.onmouseenter = () => { this.selectedIndex = 0; this.updateSelection(); };
		if (this.hasNoBtn) {
			this.btnNo.onmouseenter = () => { this.selectedIndex = 1; this.updateSelection(); };
		}
		
		this.keydownHandler = (e) => this.handleKeydown(e);
		document.addEventListener('keydown', this.keydownHandler, true); // capture phase
	}
	
	updateSelection() {
		if (this.selectedIndex === 0) {
			this.btnYes.classList.add('active');
			this.btnNo.classList.remove('active');
		} else {
			this.btnYes.classList.remove('active');
			this.btnNo.classList.add('active');
		}
	}
	
	handleKeydown(e) {
		if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
			e.preventDefault(); e.stopPropagation();
			this.selectedIndex = 0;
			this.updateSelection();
		} else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
			e.preventDefault(); e.stopPropagation();
			if (this.hasNoBtn) {
				this.selectedIndex = 1;
				this.updateSelection();
			}
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault(); e.stopPropagation();
			if (this.selectedIndex === 0) this.selectYes();
			else this.selectNo();
		} else if (e.key === 'Escape') {
			e.preventDefault(); e.stopPropagation();
			this.selectNo();
		}
	}
	
	static setCurrent(curr){ this.curr = curr; }
	static clearCurrent()  { this.curr = null; }
	
	selectYes() {
		this.clear();
		this.yes();
		return true;
	}
	
	selectNo() {
		this.clear();
		this.no();
		return false;
	}
	
	clear() {
		document.removeEventListener('keydown', this.keydownHandler, true);
		this.elem.classList.add("hide");
		if (this.wasPlayerEnabled) ui.enablePlayer(true);
		Popup.clearCurrent();
	}
}`;

code = code.replace(popupRegex, newPopupClass);
fs.writeFileSync('src/renderer/js/gwent.js', code);
