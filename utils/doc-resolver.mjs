import fs from 'fs';

const findSuperClass = (path) => new Promise(resolve => {
  const { node } = path;
  const superClassNode = node.superClass;
  if (!superClassNode) return resolve(null);

  // Obtener el path del nodo superClass
  const superClassNodePath = path.get('superClass');
  superClassNodePath.traverse({
    ClassDeclaration(innerPath) {
      return resolve(innerPath);
    }
  });
})


const resolver = (ast) => {
  const classes = [];
  const pathFile = ast.opts.filename;
  ast.traverse({
    ClassDeclaration(path) {
      if (pathFile.includes('i18n/')) return;
      if (pathFile.includes('functions/')) return;
      const { node: nodeClass } = path;
      if (!nodeClass.superClass) return;
      const isComponent = [
        nodeClass.superClass.name === 'Component',
        nodeClass.superClass.object?.name === 'React',
        nodeClass.body.body.some(member => ['state', 'props', 'jsClass'].includes(member.key.name))
      ].some(q => q);
      if (!isComponent) return;

      classes.push(path);
      const file = './tmp/add-info.json';
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '[]', 'utf-8');
      }
      const extra = JSON.parse(fs.readFileSync(file));
      const jsClass = nodeClass.body.body.find(member => member.key.name === 'jsClass');

      extra.push({
        className: nodeClass.id?.name || jsClass.value.value,
        pathFile,
        jsClass: jsClass?.value.value,
        parent: nodeClass.superClass,
      });

      fs.writeFileSync(file, JSON.stringify(extra, null, 2), 'utf-8');

    }
  });
  return classes;
};

export default resolver;
