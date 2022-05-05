import pkg from './package.json' assert { type: `json` };
import fs from 'fs';

let vArr = pkg.version.split('.');
let v = parseInt(vArr.pop());
vArr.push(++v);
pkg.version = vArr.join('.');
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

