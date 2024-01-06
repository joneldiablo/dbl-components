const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');

// Ruta raíz donde se encuentran tus componentes React
const rutaRaiz = './src/js';

// Objeto para almacenar la información de los props con rutas de archivo
const propsInfo = {};

function analizarArchivo(filePath) {
  if (filePath.endsWith('.js')) {
    const code = fs.readFileSync(filePath, 'utf-8');

    // Analizar el código con babel-parser
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx'],
    });

    // Usar babel-traverse para buscar this.props.<nombre> y destructuring
    traverse(ast, {
      ClassDeclaration(path) {
        const { node: nodeClass } = path;
        let isComponent = false;
        path.traverse({
          ClassMethod(path) {
            const { node: nodeMethod } = path;
            if (!nodeClass.superClass) return;
            isComponent = [
              nodeClass.superClass.name === 'Component',
              nodeClass.superClass.object?.name === 'React',
              ['render', 'content'].includes(nodeMethod.key.name),
              nodeClass.body.body.some(member => member.key.name === 'state')
            ].some(q => q);
          }
        });
        if (!isComponent) return;

        const parents = [];

        let tmpNode = nodeClass;
        while (tmpNode.superClass) {
          tmpNode = tmpNode.superClass;
          parents.push(tmpNode.id.name);
        }

        const componentName = nodeClass.id.name;
        propsInfo[componentName] = {
          filePath,
          props: [],
          parents
        };

        // Buscar props
        path.traverse({
          VariableDeclarator(innerPath) {
            const { node } = innerPath;
            if (
              node.init.property?.name === 'props' ||
              node.init.alternate?.name === 'props'
            ) {
              node.id.properties
                .filter(prop => !!prop.key)
                .sort((prop1, prop2) =>
                  (prop1.key.name < prop2.key.name) ? -1 :
                    ((prop1.key.name > prop2.key.name) ? 1 : 0)
                )
                .forEach(prop => {
                  if (prop.key.type === 'Identifier') {
                    propsInfo[componentName].props.push(prop.key.name);
                  }
                });
            }
          },
        });
      }
    });
  }
}

function analizarDirectorio(rutaDirectorio) {
  const archivos = fs.readdirSync(rutaDirectorio);
  archivos.forEach(archivo => {
    const filePath = path.join(rutaDirectorio, archivo);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // Si es un directorio, llamamos recursivamente a la función para analizarlo.
      analizarDirectorio(filePath);
    } else {
      // Si es un archivo, lo analizamos.
      analizarArchivo(filePath);
    }
  });
}

// Llamar a la función para analizar el directorio raíz de forma recursiva
analizarDirectorio(rutaRaiz);

// Guardar el JSON en una carpeta temporal
const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const propsInfoSorted =
  Object.entries(propsInfo)
    .sort(([, v1], [, v2]) =>
      (v1.filePath < v2.filePath) ? -1 :
        ((v1.filePath > v2.filePath) ? 1 : 0)
    ).reduce((redux, [key, c]) => {
      redux.components[key] = c;
      return redux;
    }, { components: {} });

fs.writeFileSync(`${tmpDir}/propsInfo.json`, JSON.stringify(propsInfoSorted, null, 2), 'utf-8');

console.log('JSON guardado en tmp/propsInfo.json');
