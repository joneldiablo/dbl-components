import deepMerge from "./deep-merge";
import { unflatten } from "flat";
export default (object, schema) => {
  const loop = (item) => {
    if (item === null) return item;
    if (Array.isArray(item)) {
      return item.map(a => loop(a));
    } else if (typeof item === 'object') {
      let toReturn = {};
      if (item.ref) {
        const ref = item.ref;
        delete item.ref;
        const unflattened = unflatten(item, { safe: true, delimiter: '/' });
        const refObj = loop(ref);
        const modify = loop(unflattened);
        toReturn = deepMerge({}, refObj, modify);
      } else {
        Object.keys(item).forEach(i => {
          toReturn[i] = loop(item[i])
        });
      }
      return toReturn;
    } else if (typeof item === 'string' && item[0] === '$') {
      let keys = item.substring(1).split('/');
      // Obtiene el contenido de $path/to/element 
      let data;
      try {
        data = keys.reduce((obj, key) => obj[key], schema);
        data = JSON.parse(JSON.stringify(data));
      } catch (error) {
        return { ref: item };
      }
      return loop(data);
    } else return item;
  }
  return loop(JSON.parse(JSON.stringify(object)));
}