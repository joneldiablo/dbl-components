const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const addProptypes = (className, code, props) => {

  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let newProps;
  let lineSet;

  traverse(ast, {
    ClassDeclaration(path) {
      const { node } = path;
      console.log(node);
      if (node.id.name !== className) return;
      // Variables previamente declaradas
      const prevs = [];

      // Utiliza babel-traverse para buscar la declaración de propTypes
      let propTypesNode = null;

      path.traverse({
        ClassProperty(innerpath) {
          const { node } = innerpath;
          if (
            node.static &&
            node.key.type === 'Identifier' &&
            node.key.name === 'propTypes'
          ) {
            propTypesNode = node;
            lineSet = node.loc.end.line - 1;
            if (propTypesNode.value && propTypesNode.value.properties) {
              // Accede a la matriz de propiedades
              const propertiesArray = propTypesNode.value.properties;
              prevs.push(...propertiesArray.map(p => p.key.name));
            }
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
            if (node.id && node.id.name === className) {
              linePropTypes = node.loc.start.line;
              lineSet = node.loc.start.line + 2;
            }
          },
        });

        const codeArr = code.split('\n');
        codeArr.splice(linePropTypes, 0, newPropTypes);
        code = codeArr.join('\n');

      }

      newProps = props
        .filter(p => !prevs.includes(p))
        .map(p => `    ${p}: PropTypes.any`).join(',\n');


    }
  });

  if (!newProps.length) return code;

  const codeArr = code.split('\n');
  codeArr.splice(lineSet, 0, newProps);
  if (!(codeArr[lineSet - 1].match(/(^|[\{,])\s*$/)))
    codeArr[lineSet - 1] += ',';

  // Agrega la importación de PropTypes si no está presente
  if (!code.includes('import PropTypes from')) {
    codeArr.unshift('import PropTypes from \'prop-types\';');
  }

  code = codeArr.join('\n');

  return code;
};

module.exports = {
  addProptypes
};
