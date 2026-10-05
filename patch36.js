const fs = require('fs');
fs.writeFileSync('.gitignore', `node_modules/
dist/
build/
.DS_Store
*.log
src/renderer/assets/videos/GWENT INTRO.mp4`);
