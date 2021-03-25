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
        toReturn = deepMerge(loop(ref), loop(item));
      } else {
        Object.keys(item).forEach(i => {
          toReturn[i] = loop(item[i])
        });
      }
      return toReturn;
    } else if (typeof item === 'string' && item[0] === '$') {
      let keys = item.substring(1).split('/');
      // Obtiene el contenido de $path/to/element 
      // si el objeto es arreglo, se deviuelve tal cual, si es objeto se integra su llave como name
      let data = keys.reduce(
        (obj, key) => (Array.isArray(obj[key]) ? obj[key] : { ...obj[key], name: key }),
        schema);
      return loop(data);
    } else return item;
  }
  return loop(object);
}