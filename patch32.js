const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

css = css.replace(/opacity: 0\.3; \/\* Little opacity for background \*\//g, "opacity: 0.15; /* Dimmed more */");

css = css.replace(/\.mp-panel \{[\s\S]*?flex: 1;\n\}/g, `.mp-panel {
	background: rgba(15,15,15,0.7);
	border: 1px solid rgba(182,139,68,0.3);
	display: flex;
	flex-direction: column;
	flex: 0 0 35%; /* Fixed height to reduce it */
	max-height: 25vh;
}`);

const refreshCss = `
.mp-refresh-btn {
	margin-left: auto;
	color: #b68b44;
	cursor: pointer;
	font-size: 1.5vw;
	line-height: 1;
	transition: all 0.2s;
}
.mp-refresh-btn:hover {
	color: #e5cd85;
	transform: rotate(90deg);
}
`;
css = css.replace(/\.mp-panel-header h2 \{/g, refreshCss + '\n.mp-panel-header h2 {');

fs.writeFileSync('src/renderer/css/style.css', css);
