const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

css = css.replace(/background: url\('\.\.\/assets\/img\/ui\/main_bg\.jpg'\) center\/cover no-repeat;/g, "background: url('../assets/img/multiplayer_bg.png') center/cover no-repeat;");
css = css.replace(/opacity: 0\.4; \/\* Dim background for contrast \*\//g, "opacity: 0.3; /* Little opacity for background */");

fs.writeFileSync('src/renderer/css/style.css', css);
