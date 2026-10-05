const fs = require('fs');
let code = fs.readFileSync('src/renderer/css/style.css', 'utf8');

// Replace all popup CSS block
const popupRegex = /#popup \{[\s\S]*?#popup button:last-child:hover \{color: red; \}/;

const newPopupCss = `
/* ===== NATIVE GWENT POPUP ===== */
#popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(10, 10, 10, 0.75); /* Subtle dark overlay */
    z-index: 20000;
    display: flex;
    justify-content: center;
    align-items: center;
}

#popup.hide {
    display: none !important;
}

#popup .popup-box {
    width: 35vw;
    max-width: 600px;
    border: 1px solid rgba(255, 255, 255, 0.15); /* Thin elegant border */
    padding: 3vw 2vw;
    background-color: rgba(15, 15, 15, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.9);
}

#popup .popup-header {
    display: none; /* Hide header completely per requirements */
}

#popup .popup-description {
    text-align: center;
    font-size: 1.3vw;
    color: rgba(220, 220, 220, 0.9);
    font-family: 'Cinzel', 'Palatino Linotype', serif;
    margin-bottom: 3vw;
    text-transform: uppercase;
    line-height: 1.4;
    letter-spacing: 0.05vw;
}

#popup .popup-buttons {
    display: flex;
    justify-content: center;
    gap: 4vw;
}

#popup .popup-btn {
    font-size: 1.1vw;
    font-family: Arial, sans-serif;
    color: rgba(150, 150, 150, 0.8);
    text-transform: uppercase;
    cursor: pointer;
    letter-spacing: 0.1vw;
    padding: 0.5vw 1vw;
    transition: color 0.1s;
}

#popup .popup-btn:hover {
    color: rgba(200, 200, 200, 1);
}

#popup .popup-btn.active {
    color: #e5cd85; /* Warm gold */
}

/* Add a pseudo-element subtle dark grey rectangle for active highlight just like settings menu */
#popup .popup-btn.active::before {
    content: '';
    position: absolute;
    background: rgba(30, 30, 30, 0.8);
    z-index: -1;
    /* We will use inline style or JS to position this if we want, or just simple background */
}
#popup .popup-btn.active, #popup .popup-btn:hover {
    background: rgba(30, 30, 30, 0.8);
    color: #e5cd85;
}
`;

code = code.replace(popupRegex, newPopupCss);
fs.writeFileSync('src/renderer/css/style.css', code);
