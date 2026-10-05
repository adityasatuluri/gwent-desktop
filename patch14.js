const fs = require('fs');
let code = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');

const oldCheck = `if (introScreen && introVideo) {
    // Start video
    introVideo.play().catch(err => {
        console.error("Intro video failed to play:", err);
        skipIntro(); // Fallback
    });`;

const newCheck = `if (introScreen && introVideo) {
    // Check if intro already played this session (via location.reload())
    if (sessionStorage.getItem('introPlayed') === 'true') {
        skipIntro();
    } else {
        sessionStorage.setItem('introPlayed', 'true');
        // Start video
        introVideo.play().catch(err => {
            console.error("Intro video failed to play:", err);
            skipIntro(); // Fallback
        });
    }
`;

code = code.replace(oldCheck, newCheck);
fs.writeFileSync('src/renderer/js/gwent.js', code);
