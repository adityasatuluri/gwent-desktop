const fs = require('fs');
const js = fs.readFileSync('src/renderer/js/gwent.js', 'utf8');
try {
  new Function(js);
  console.log('Valid syntax');
} catch(e) {
  console.log(e);
}
