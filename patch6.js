const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const oldKeydownCap = `	if (capturingKey) {
		let k = e.key;
		if (k === ' ') k = 'Space';
		else if (k.length === 1) k = k.toLowerCase();
		if (capturingKey === 'keybind-confirm') Settings.keyConfirm.set(k);
		else if (capturingKey === 'keybind-cancel') Settings.keyCancel.set(k);
		else if (capturingKey === 'keybind-leader') Settings.keyLeader.set(k);
		document.getElementById('setting-' + capturingKey + '-val').textContent = ((k === ' ') ? 'Space' : k).toUpperCase();
		capturingKey = null;
		e.preventDefault();
		return;
	}`;

const captureFunc = `
let isCapturingInput = false;
let capturingAction = null;

function formatInputName(key) {
  if (key === ' ') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return key;
}

function assignBinding(action, inputName) {
  const currentControls = Settings.controls.get();
  
  // Check for conflicts
  let conflictAction = null;
  for (const [a, k] of Object.entries(currentControls)) {
    if (k.toLowerCase() === inputName.toLowerCase() && a !== action) {
      conflictAction = a;
      break;
    }
  }

  if (conflictAction) {
    const popupFunc = (typeof ui !== 'undefined' && ui.popup) ? ui.popup : (a, b, c, d, e, f) => new Popup(a, b, c, d, e, f);
    popupFunc("YES", () => {
      currentControls[conflictAction] = ""; // clear old
      currentControls[action] = inputName;
      Settings.controls.set(currentControls);
      syncSettingsDisplay();
    }, "NO", () => {
      syncSettingsDisplay();
    }, "CONFLICT", inputName + " is already assigned to another action. Replace it?");
  } else {
    currentControls[action] = inputName;
    Settings.controls.set(currentControls);
    syncSettingsDisplay();
  }
}

function captureNextInput(actionName) {
  isCapturingInput = true;
  capturingAction = actionName;
  
  const handleKey = (e) => {
    e.preventDefault();
    if (e.key === 'Escape') {
      cleanup();
      syncSettingsDisplay();
      return;
    }
    const inputName = formatInputName(e.key);
    cleanup();
    assignBinding(capturingAction, inputName);
  };
  
  const handleMouse = (e) => {
    e.preventDefault();
    let inputName = 'Mouse ' + (e.button + 1);
    cleanup();
    assignBinding(capturingAction, inputName);
  };
  
  const cleanup = () => {
    isCapturingInput = false;
    capturingAction = null;
    document.removeEventListener('keydown', handleKey, {capture: true});
    document.removeEventListener('mousedown', handleMouse, {capture: true});
  };
  
  // Add listeners
  setTimeout(() => {
    document.addEventListener('keydown', handleKey, {capture: true});
    document.addEventListener('mousedown', handleMouse, {capture: true});
  }, 50);
}
`;

code = code.replace(oldKeydownCap, '');
// Insert captureFunc before let settingsOpenedFrom = 'menu';
code = code.replace("let settingsOpenedFrom = 'menu';", captureFunc + "\nlet settingsOpenedFrom = 'menu';");
fs.writeFileSync('src/renderer/js/gwent.js', code);
