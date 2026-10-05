const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

css = css.replace(/flex: 0 0 35%; \/\* Fixed height to reduce it \*\/\n\tmax-height: 25vh;/g, "flex: 0 0 auto;\n\tmin-height: 20vh;\n\tmax-height: 35vh;");

fs.writeFileSync('src/renderer/css/style.css', css);
