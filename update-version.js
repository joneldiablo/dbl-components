const pkg = require('./package.json');
const fs = require('fs');

let vArr = pkg.version.split('.');
let v = parseInt(vArr.pop());
vArr.push(++v);
pkg.version = vArr.join('.');
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

