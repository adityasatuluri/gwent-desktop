const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

// Replace let introActive with window.introActive throughout the intro block
code = code.replace(/let introActive = true;/g, "window.introActive = true;");
code = code.replace(/if \(!introActive\) return;/g, "if (!window.introActive) return;");
code = code.replace(/introActive = false;/g, "window.introActive = false;");
code = code.replace(/if \(introActive\) \{/g, "if (window.introActive) {");

// Now update the game music logic to respect introActive
code = code.replace(/if \(Settings\.music\.isEnabled\(\)\) this\.youtube\.play\(\)\.catch\(e=>console\.log\('Audio blocked',e\)\);/g, "if (Settings.music.isEnabled() && !window.introActive) this.youtube.play().catch(e=>console.log('Audio blocked',e));");
code = code.replace(/if \(Settings\.music\.isEnabled\(\)\) this\.youtube\.play\(\)\.catch\(e=>console\.log\('Track play failed',e\)\);/g, "if (Settings.music.isEnabled() && !window.introActive) this.youtube.play().catch(e=>console.log('Track play failed',e));");
code = code.replace(/if\(Settings\.music\.isEnabled\(\)\) this\.youtube\?\.play\(\);/g, "if(Settings.music.isEnabled() && !window.introActive) this.youtube?.play();");
code = code.replace(/if\(enable && Settings\.music\.isEnabled\(\)\) this\.youtube\?\.play\(\);/g, "if(enable && Settings.music.isEnabled() && !window.introActive) this.youtube?.play();");

// Finally, make skipIntro() resume music
const oldSkipIntro = `    // Cleanup listeners
    document.removeEventListener('mousemove', onIntroMouseMove);
    document.removeEventListener('keydown', onIntroKeyDown, true);
    document.removeEventListener('mousedown', onIntroMouseDown, true);
}`;

const newSkipIntro = `    // Cleanup listeners
    document.removeEventListener('mousemove', onIntroMouseMove);
    document.removeEventListener('keydown', onIntroKeyDown, true);
    document.removeEventListener('mousedown', onIntroMouseDown, true);
    
    // Resume game music
    if (typeof ui !== 'undefined' && ui.youtube && Settings.music.isEnabled()) {
        ui.youtube.play().catch(e => console.log('Audio blocked', e));
    }
}`;

code = code.replace(oldSkipIntro, newSkipIntro);

fs.writeFileSync('src/renderer/js/gwent.js', code);
