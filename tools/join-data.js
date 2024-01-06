const fs = require('fs');

const componentsInfo = require('../tmp/components-info.json');
const addInfo = require('../tmp/add-info.json');

const newObj = Object.entries(componentsInfo).map(([pathFile, components]) =>
  components.map(component => {
    const extraInfo = addInfo.find(comp => comp.pathFile === pathFile && comp.className === component.displayName) || {};
    Object.assign(component, extraInfo);
    return component;
  })
).flat();

fs.writeFileSync('tmp/components-info.json', JSON.stringify(newObj, null, 2), 'utf-8');
fs.unlinkSync('tmp/add-info.json');