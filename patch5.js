const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

// Replace keyConfirm, keyCancel, keyLeader usages in syncSettingsDisplay
code = code.replace(/document\.getElementById\('setting-keybind-confirm-val'\)\.textContent = Settings\.keyConfirm\.get\(\)\.toUpperCase\(\);/g, "document.getElementById('setting-keybind-confirmPass-val').textContent = Settings.controls.get().confirmPass.toUpperCase();");
code = code.replace(/document\.getElementById\('setting-keybind-cancel-val'\)\.textContent = Settings\.keyCancel\.get\(\)\.toUpperCase\(\);/g, "document.getElementById('setting-keybind-pauseMenu-val').textContent = Settings.controls.get().pauseMenu.toUpperCase();");
code = code.replace(/document\.getElementById\('setting-keybind-leader-val'\)\.textContent = Settings\.keyLeader\.get\(\)\.toUpperCase\(\);/g, "document.getElementById('setting-keybind-leaderAbility-val').textContent = Settings.controls.get().leaderAbility.toUpperCase();\n\t\tdocument.getElementById('setting-keybind-selectCard-val').textContent = Settings.controls.get().selectCard.toUpperCase();\n\t\tdocument.getElementById('setting-keybind-cancelPreview-val').textContent = Settings.controls.get().cancelPreview.toUpperCase();");

// Replace applySettingAtIndex logic
const oldApply = `    } else if (ds.startsWith('keybind-')) {
		capturingKey = ds;
		document.getElementById('setting-' + ds + '-val').textContent = "Press any key...";
	}
  }`;

const newApply = `    } else if (ds === 'keybind-reset') {
      if (typeof ui !== 'undefined' && ui.popup) {
        ui.popup("YES", () => {
          Settings.controls.set({ selectCard: "Mouse 1", cancelPreview: "Mouse 2", confirmPass: "Enter", pauseMenu: "Escape", leaderAbility: "X" });
          syncSettingsDisplay();
        }, "NO", () => {}, "RESET CONTROLS", "Reset all controls to default?");
      } else {
        new Popup("YES", () => {
          Settings.controls.set({ selectCard: "Mouse 1", cancelPreview: "Mouse 2", confirmPass: "Enter", pauseMenu: "Escape", leaderAbility: "X" });
          syncSettingsDisplay();
        }, "NO", () => {}, "RESET CONTROLS", "Reset all controls to default?");
      }
    } else if (ds.startsWith('keybind-')) {
      const actionName = ds.replace('keybind-', '');
      document.getElementById('setting-' + ds + '-val').textContent = "PRESS A KEY...";
      captureNextInput(actionName);
    }
  }`;
code = code.replace(oldApply, newApply);

fs.writeFileSync('src/renderer/js/gwent.js', code);
