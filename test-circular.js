const fs = require('fs');
const card_dict = JSON.parse(fs.readFileSync('src/renderer/assets/cards.json', 'utf8'));
try {
  JSON.stringify(card_dict[0]);
  console.log("No circular references in card_dict");
} catch(e) {
  console.log("Circular reference!", e);
}
