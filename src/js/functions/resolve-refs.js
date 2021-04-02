import deepMerge from "./deep-merge";
export default (object, schema) => {
  const loop = (item) => {
    if (Array.isArray(item)) {
      return item.map(a => loop(a));
    } else if (typeof item === 'object') {
      let toReturn = {};
      if (item.ref) {
        let ref = item.ref;
        delete item.ref;
        const refObj = loop(ref);
        const modify = loop(item);
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
      let data = keys.reduce((obj, key) => obj[key], schema);
      data = JSON.parse(JSON.stringify(data));
      return loop(data);
    } else return item;
  }
  return loop(object);
}