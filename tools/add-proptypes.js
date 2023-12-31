#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs');
const { addProptypes } = require('../utils/add-proptypes'); // Reemplaza con la ruta correcta a tu módulo

// Define los argumentos de la línea de comandos utilizando yargs
const argv = yargs
  .usage('Usage: $0 --file <file> --class <class> --props <props>')
  .option('file', {
    alias: 'f',
    describe: 'Ruta del archivo que deseas modificar',
    demandOption: false,
  })
  .option('className', {
    alias: 'c',
    describe: 'Nombre de la clase en la que deseas agregar propTypes',
    demandOption: false,
  })
  .option('props', {
    alias: 'p',
    describe: 'Lista de props separadas por comas',
    demandOption: false,
  })
  .option('componentList', {
    alias: 'l',
    describe: 'Listado de componentes en archivo json',
    demandOption: false,
  })
  .help()
  .argv;

const one = (className, { filePath, props }) => {

  // Lee el contenido del archivo
  let code = fs.readFileSync(filePath, 'utf-8');

  // Llama a la función addProptypes para modificar el código
  code = addProptypes(className, code, props);

  // Sobrescribe el archivo con el código modificado
  fs.writeFileSync(filePath, code, 'utf-8');

  return true;
}

// Función principal
const main = async ({ file, className, props, componentList }) => {
  if (componentList) {
    const list = JSON.parse(fs.readFileSync(componentList, 'utf-8'));
    return Object.entries(list.components)
      .reduce((redux, [className, componentData]) => {
        try {
          redux[className] = one(className, componentData);
        } catch (error) {
          redux[className] = error;
        }
        return redux;
      }, {});
  } else {
    return one(className, {
      filePath: file,
      props: props.split(',').map(p => p.trim())
    });
  }
};

// Ejecuta la función principal
main(argv).then(r => {
  console.log('done');
  console.log(r);
  process.exit();
}).catch((error) => {
  console.error('error');
  console.error('Ocurrió un error inesperado:', error.message);
  process.exit(1);
});
