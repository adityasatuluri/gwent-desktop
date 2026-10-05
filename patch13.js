const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

// Replace onIntroMouseMove, onIntroKeyDown, etc.
const oldLogicRegex = /function onIntroMouseMove\([\s\S]*?function onIntroKeyDown\(e\) \{[\s\S]*?\}\n\nfunction onIntroMouseDown\(e\) \{[\s\S]*?\}/;

const newLogic = `function onIntroKeyDown(e) {
    if (!window.introActive) return;
    e.stopPropagation();
    e.preventDefault();
    if (e.key === 'Escape') {
        skipIntro();
    }
}

function onIntroMouseDown(e) {
    if (!window.introActive) return;
    if (e.target === skipBtn) {
        skipIntro();
    } else {
        e.stopPropagation();
        e.preventDefault();
    }
}`;

code = code.replace(oldLogicRegex, newLogic);

// Remove mousemove listener attach/cleanup
code = code.replace(/document\.removeEventListener\('mousemove', onIntroMouseMove\);\s*/g, '');
code = code.replace(/setTimeout\(\(\) => \{\s*if \(window\.introActive\) \{\s*document\.addEventListener\('mousemove', onIntroMouseMove\);\s*\}\s*\}, 100\);\s*/g, '');

fs.writeFileSync('src/renderer/js/gwent.js', code);
