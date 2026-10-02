const fs=require('fs');
eval(fs.readFileSync('src/renderer/js/cards.js','utf8'));
const me_deck = {
    faction: "realms",
    leader: card_dict[24],
    cards: [{index: 5, count: 1}, {index: 1, count: 3}]
};
try {
    let str = JSON.stringify(me_deck);
    console.log("SUCCESS:", str.substring(0, 50));
} catch(e) {
    console.log("ERROR:", e);
}
