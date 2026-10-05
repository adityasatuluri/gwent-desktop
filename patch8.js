const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const newGlobalInput = `
document.addEventListener("click", (e) => {
    if (!NavigationManager.isScreenActive('game-view') && !NavigationManager.isScreenActive('deck-customization')) return;
    const selectBind = Settings.controls.get().selectCard;
    if (selectBind.toLowerCase() !== "mouse 1") {
        if (e.target.closest('.card') || e.target.closest('.field') || e.target.closest('.hero-skill')) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}, true);

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (isCapturingInput) return;
    const cancelBind = Settings.controls.get().cancelPreview;
    if (cancelBind.toLowerCase() === 'mouse 2') {
        if (typeof ui !== 'undefined' && ui && typeof ui.cancel === 'function') ui.cancel();
        if (typeof Carousel !== 'undefined' && Carousel.curr) Carousel.curr.cancel();
    }
});

function handleGameplayInput(inputName) {
    if (isCapturingInput) return false;
    const controls = Settings.controls.get();
    inputName = inputName.toLowerCase();
    
    // Select / Place Card
    if (inputName === controls.selectCard.toLowerCase() && inputName !== "mouse 1") {
        const hoverEls = document.querySelectorAll(':hover');
        if (hoverEls.length > 0) {
            let target = hoverEls[hoverEls.length - 1];
            if (target.closest('.card') || target.closest('.field') || target.closest('.hero-skill') || target.closest('.deck-card') || target.closest('.bank-card')) {
                target.click();
                return true;
            }
        }
    }
    
    // Cancel / Preview Card
    if (inputName === controls.cancelPreview.toLowerCase() && inputName !== "mouse 2") {
        if (typeof ui !== 'undefined' && ui && typeof ui.cancel === 'function') ui.cancel();
        if (typeof Carousel !== 'undefined' && Carousel.curr) Carousel.curr.cancel();
        return true;
    }
    return false;
}

window.addEventListener('mousedown', (e) => {
    if (isCapturingInput) return;
    let inputName = 'Mouse ' + (e.button + 1);
    handleGameplayInput(inputName);
});
`;

// Insert the new global input logic before the keydown listener
code = code.replace("document.addEventListener('keydown', (e) => {", newGlobalInput + "\n  document.addEventListener('keydown', (e) => {");

// Remove the old contextmenu listener from gwent.js
code = code.replace(/document\.addEventListener\("contextmenu", \(e\) => \{\s*e\.preventDefault\(\);\s*if \(typeof ui !== 'undefined' && ui && ui\.previewCard\) \{\s*ui\.cancel\(\);\s*\}\s*\}\);/g, '');

fs.writeFileSync('src/renderer/js/gwent.js', code);
