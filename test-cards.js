const fs = require('fs');
const card_dict = JSON.parse(fs.readFileSync('src/renderer/assets/cards.json', 'utf8'));
const Card = class {
    constructor(card_data) {
  		this.name = card_data.name;
  		this.faction = card_data.deck;
  		this.row = (card_data.deck === "weather") ? card_data.deck : card_data.row;
  		this.filename = card_data.filename;
    }
}
let errors = 0;
card_dict.forEach((cd, i) => {
    let c = new Card(cd);
    let idx = card_dict.findIndex(cd => cd.name === c.name && cd.filename === c.filename && cd.deck === c.faction && (cd.row === c.row || (cd.deck === 'weather' && c.row === 'weather')));
    if (idx !== i && idx === -1) {
        console.log('Cannot find', c);
        errors++;
    }
});
console.log('Errors:', errors);
