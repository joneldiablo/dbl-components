import fs from 'fs';

import { deepMerge } from "dbl-utils";

const componentsInfo = JSON.parse(fs.readFileSync('./tmp/components-info.json', 'utf-8'));
const addInfo = JSON.parse(fs.readFileSync('./tmp/add-info.json', 'utf-8'));

const newObj = Object.entries(componentsInfo).map(([pathFile, components]) =>
  components.map(component => {
    const extraInfo = addInfo.find(comp =>
      comp.pathFile === pathFile
      && comp.className === component.displayName
    ) || {};
    Object.assign(component, extraInfo);
    return component;
  })
).flat();

function findSuperProps(component, components, props = component.props) {
  if (!component.parent) return props;
  const parent = components.find(c => c.displayName === component.parent.name);
  if (!parent) return props;
  if (parent.type === "MemberExpression") return props;
  props = deepMerge({}, parent.props, props);
  props = findSuperProps(parent, components, props);
  return props;
}

newObj.forEach(component =>
  (component.props = deepMerge({}, findSuperProps(component, newObj), component.props))
);

fs.writeFileSync('tmp/components-info.json', JSON.stringify(newObj, null, 2), 'utf-8');
fs.unlinkSync('tmp/add-info.json');