const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Ruta del archivo que deseas modificar
const filePath = 'src/js/component.js';

let code = fs.readFileSync(filePath, 'utf-8');

const ast = parser.parse(code, {
  sourceType: 'module',
  plugins: ['jsx'],
});

// Utiliza babel-traverse para buscar la declaración de propTypes
const prevs = [];
let propTypesNode = null;
let lineSet;

traverse(ast, {
  ClassProperty(path) {
    const node = path.node;
    if (
      node.static &&
      node.key.type === 'Identifier' &&
      node.key.name === 'propTypes'
    ) {
      propTypesNode = node;
      lineSet = node.loc.end.line - 1;
      path.traverse({
        VariableDeclarator(innerPath) {
          const { node } = innerPath;
          console.log(node);
          prevs.push(node.key.name);
        }
      });
    }
  },
});

if (!propTypesNode) {

  const newPropTypes = `
  static propTypes = {
  }`;
  let linePropTypes;
  // Encuentra la clase y agrega la declaración de propTypes debajo de ella
  traverse(ast, {
    ClassDeclaration(path) {
      const { node } = path;
      linePropTypes = node.loc.start.line;
      lineSet = node.loc.start.line + 2;
    },
  });

  const codeArr = code.split('\n');
  codeArr.splice(linePropTypes, 0, newPropTypes);
  code = codeArr.join('\n');
  fs.writeFileSync(filePath, code, 'utf-8');
}


const data = {
  "filePath": "src/js/component.js",
  "props": [
    "active",
    "classes",
    "name",
    "style",
    "tag"
  ]
}

const newProps = data.props
  .filter(p => !prevs.includes(p))
  .map(p => `    ${p}: PropTypes.any`).join(',\n');

const codeArr = code.split('\n');
codeArr.splice(lineSet, 0, newProps);
if (!(codeArr[lineSet - 1].match(/(^|[\{,])\s*$/)))
  codeArr[lineSet - 1] += ',';
code = codeArr.join('\n');
fs.writeFileSync(filePath, code, 'utf-8');

console.log('LINE AT', prevs, newProps);