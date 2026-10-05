const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

css = css.replace(/\.mp-refresh-btn \{[\s\S]*?justify-content: center;\n\}/g, `$&
.mp-refresh-btn:hover {
	color: #e5cd85;
	transform: rotate(90deg);
}`);

fs.writeFileSync('src/renderer/css/style.css', css);
