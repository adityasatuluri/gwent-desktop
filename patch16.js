const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const oldPopupRegex = /class Popup \{[\s\S]*?\n\}/;

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
		this.btnNo.innerHTML = (noName) ? noName : "No";

		// Background overlay alpha
		this.elem.style.backgroundColor = 'rgba(10, 10, 10, ' + alpha + ')';
		
		this.elem.classList.remove("hide");
		Popup.setCurrent(this);
		ui.enablePlayer(false);
		
		this.selectedIndex = 0; // 0 for Yes, 1 for No
		this.updateSelection();
		
		// Mouse interactions
		this.btnYes.onmouseenter = () => { this.selectedIndex = 0; this.updateSelection(); };
		this.btnNo.onmouseenter = () => { this.selectedIndex = 1; this.updateSelection(); };
		
		// Keyboard listener
		this.keydownHandler = (e) => this.handleKeydown(e);
		document.addEventListener('keydown', this.keydownHandler, true); // capture phase
		
		// Prevent clicking on background from doing anything, or maybe close it?
		// User: "ESCAPE -> close dialog / behave as NO"
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
		e.preventDefault();
		e.stopPropagation();
		if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
			this.selectedIndex = 0;
			this.updateSelection();
		} else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
			this.selectedIndex = 1;
			this.updateSelection();
		} else if (e.key === 'Enter' || e.key === ' ') {
			if (this.selectedIndex === 0) this.selectYes();
			else this.selectNo();
		} else if (e.key === 'Escape') {
			this.selectNo();
		}
	}
	
	// Sets this as the current popup window
	static setCurrent(curr){ this.curr = curr; }
	
	// Unsets this as the current popup window
	static clearCurrent()  { this.curr = null; }
	
	// Called when client selects the positive action
	selectYes() {
		this.clear();
		this.yes();
		return true;
	}
	
	// Called when client selects the negative option
	selectNo() {
		this.clear();
		this.no();
		return false;
	}
	
	// Clears the popup
	clear() {
		document.removeEventListener('keydown', this.keydownHandler, true);
		this.elem.classList.add("hide");
		Popup.clearCurrent();
	}
}`;

code = code.replace(oldPopupRegex, newPopupClass);
fs.writeFileSync('src/renderer/js/gwent.js', code);
