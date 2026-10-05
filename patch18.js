const fs = require('fs');
let html = fs.readFileSync('src/renderer/index.html', 'utf8');

const regex = /<section id="popup" class="center hide">[\s\S]*?<\/section>/;

const newPopup = `<section id="popup" class="center hide">
\t\t<div class="popup-box">
\t\t\t<h3 class="popup-header hide"></h3>
\t\t\t<p class="popup-description"></p>
\t\t\t<div class="popup-buttons">
\t\t\t\t<div class="popup-btn active" id="popup-btn-yes" onclick="Popup.curr.selectYes()"></div>
\t\t\t\t<div class="popup-btn" id="popup-btn-no" onclick="Popup.curr.selectNo()"></div>
\t\t\t</div>
\t\t</div>
\t</section>`;

html = html.replace(regex, newPopup);
fs.writeFileSync('src/renderer/index.html', html);
