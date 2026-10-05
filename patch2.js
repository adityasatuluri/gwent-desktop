
const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

let newInSettings = 
    if (inSettings) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSettingActive((settingIndex - 1 + getSettingRows().length) % getSettingRows().length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSettingActive((settingIndex + 1) % getSettingRows().length);
      } else if (e.key === 'Enter' || e.key.toLowerCase() === Settings.keyConfirm.get().toLowerCase()) {
        flashItem(getSettingRows()[settingIndex], () => applySettingAtIndex(settingIndex));
      } else if (e.key === 'Escape' || e.key === 'Backspace' || e.key.toLowerCase() === Settings.keyCancel.get().toLowerCase()) {
        closeSettings();
      }
      return;
    };

let newInMenu = 
    if (!mainMenu.classList.contains('hide')) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMenuActive((menuIndex - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMenuActive((menuIndex + 1) % menuItems.length);
      } else if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === Settings.keyConfirm.get().toLowerCase()) {
        flashItem(menuItems[menuIndex], () => selectMainItem(menuIndex));
      }
    };

code = code.replace(/if \(inSettings\) \{[\s\S]*?return;\s*\}/, newInSettings.trim());
code = code.replace(/if \(!mainMenu\.classList\.contains\('hide'\)\) \{[\s\S]*?\}\s*\}\s*\n*\s*\}\);\s*\n*\s*\(\)\(\);/m, newInMenu.trim() + '\n  });\n})();');

fs.writeFileSync('src/renderer/js/gwent.js', code);

