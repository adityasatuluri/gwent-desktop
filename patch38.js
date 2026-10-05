const fs = require('fs');
let css = fs.readFileSync('src/renderer/css/style.css', 'utf8');

css = css.replace(/min-height: 20vh;\n\tmax-height: 35vh;/g, "min-height: 25vh;\n\tmax-height: 45vh;");

const avatarCss = `
.mp-profile-medallion {
	width: 6vw;
	height: 6vw;
	background: rgba(0,0,0,0.5) url('../assets/img/ui/wolf_medallion.png') center/cover no-repeat;
	border-right: 1px solid rgba(182,139,68,0.3);
	position: relative;
	cursor: pointer;
}
.mp-avatar-edit-overlay {
	position: absolute;
	top: 0; left: 0; width: 100%; height: 100%;
	background: rgba(0,0,0,0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	opacity: 0;
	transition: opacity 0.2s;
}
.mp-profile-medallion:hover .mp-avatar-edit-overlay {
	opacity: 1;
}
.mp-icon-svg {
	display: block;
}
.mp-username-input:not([readonly]) {
	border-bottom: 1px solid #b68b44;
	background: rgba(0,0,0,0.3);
}
#mp-edit-name-btn:hover {
	color: #e5cd85 !important;
}
.mp-refresh-btn {
	margin-left: auto;
	color: #b68b44;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
}
`;

css = css.replace(/\.mp-profile-medallion \{[\s\S]*?border-right: 1px solid rgba\(182,139,68,0\.3\);\n\}/g, avatarCss);

// Remove the old .mp-refresh-btn from CSS since we redefining it in avatarCss string.
css = css.replace(/\.mp-refresh-btn \{[\s\S]*?transform: rotate\(90deg\);\n\}/g, '');

fs.writeFileSync('src/renderer/css/style.css', css);
