const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const introLogic = `
// ===== INTRO SEQUENCE =====
let introActive = true;
let introVideo = document.getElementById('intro-video');
let introScreen = document.getElementById('intro-screen');
let skipBtn = document.getElementById('intro-skip-btn');
let initialMouseX = null;
let initialMouseY = null;
let escPressTime = 0;

function skipIntro() {
    if (!introActive) return;
    introActive = false;
    
    // Stop video and audio
    if (introVideo) {
        introVideo.pause();
        introVideo.src = "";
        introVideo.removeAttribute('src');
        introVideo.load();
    }
    
    // Remove overlay
    if (introScreen) {
        introScreen.remove();
    }
    
    // Cleanup listeners
    document.removeEventListener('mousemove', onIntroMouseMove);
    document.removeEventListener('keydown', onIntroKeyDown, true);
    document.removeEventListener('mousedown', onIntroMouseDown, true);
}

function onIntroMouseMove(e) {
    if (!introActive) return;
    if (initialMouseX === null || initialMouseY === null) {
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        return;
    }
    const dx = e.clientX - initialMouseX;
    const dy = e.clientY - initialMouseY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        skipIntro();
    }
}

function onIntroKeyDown(e) {
    if (!introActive) return;
    
    // Stop event reaching main menu
    e.stopPropagation();
    
    if (e.key === 'Escape') {
        const now = Date.now();
        if (now - escPressTime < 700) {
            skipIntro();
        } else {
            escPressTime = now;
            // First press, wait for second
        }
    }
}

function onIntroMouseDown(e) {
    if (!introActive) return;
    
    // If clicking skip button, let it bubble to the button's listener or handle here
    if (e.target === skipBtn) {
        skipIntro();
    } else {
        // Normal clicks don't skip unless it's a mouse movement? Wait, user asked for mouse movement, skip button, double esc.
        // Did user ask for mouse click to skip? "Mouse movement -> skip, Skip button click -> skip, ESC+ESC -> skip"
        // Let's just prevent default to stop interacting with main menu
        e.stopPropagation();
    }
}

if (introScreen && introVideo) {
    // Start video
    introVideo.play().catch(err => {
        console.error("Intro video failed to play:", err);
        skipIntro(); // Fallback
    });
    
    introVideo.addEventListener('ended', skipIntro);
    if (skipBtn) skipBtn.addEventListener('click', skipIntro);
    
    // Delay adding mousemove listener so we don't instantly skip from initial browser position pulse
    setTimeout(() => {
        if (introActive) {
            document.addEventListener('mousemove', onIntroMouseMove);
        }
    }, 100);
    
    document.addEventListener('keydown', onIntroKeyDown, true); // capture phase
    document.addEventListener('mousedown', onIntroMouseDown, true); // capture phase
}
`;

code += "\n\n" + introLogic;
fs.writeFileSync('src/renderer/js/gwent.js', code);
