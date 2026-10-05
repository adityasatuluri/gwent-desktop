const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

const lastMpIndex = css.lastIndexOf('/* ---- MULTIPLAYER LOBBY ---- */');
const nextSection = css.indexOf('/* Controls Screen specific overrides */', lastMpIndex);

if (lastMpIndex !== -1 && nextSection !== -1) {
    css = css.substring(0, lastMpIndex) + css.substring(nextSection);
    fs.writeFileSync('src/renderer/css/style.css', css);
    console.log('Removed duplicate multiplayer CSS');
} else {
    console.log('Could not find boundaries', lastMpIndex, nextSection);
}
