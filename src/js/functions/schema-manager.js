import deepMerge from "./deep-merge";
class SchemaManager {
  _schema;

  set schema(s) {
    this._schema = s;
  }

  get schema() {
    return this._schema;
  }

  resolveRefs(item) {
    if (Array.isArray(item)) {
      return item.map(a => this.resolveRefs(a));
    } else if (typeof item === 'object') {
      let toReturn = {};
      if (item.ref) {
        let ref = item.ref;
        delete item.ref;
        toReturn = deepMerge(this.resolveRefs(ref), this.resolveRefs(item));
      } else {
        Object.keys(item).forEach(i => {
          toReturn[i] = this.resolveRefs(item[i])
        });
      }
      return toReturn;
    } else if (typeof item === 'string' && item[0] === '$') {
      let keys = item.substring(1).split('.');
      //Obtiene el contenido de $path.to.element 
      //se podría obtener igual si hagop flatten el objeto
      let data = keys.reduce((obj, key) => obj[key], this._schema);
      return this.resolveRefs(data);
    } else return item;
  }
}

const schemaManager = new SchemaManager();
export default schemaManager;
