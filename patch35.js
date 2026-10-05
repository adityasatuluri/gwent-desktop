const fs = require('fs');
let gi = fs.readFileSync('.gitignore', 'utf8');
gi = gi.replace(/"src\/renderer\/assets\/videos\/GWENT INTRO\.mp4"/g, 'src/renderer/assets/videos/GWENT INTRO.mp4');
fs.writeFileSync('.gitignore', gi);
