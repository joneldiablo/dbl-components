/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}


/**
 * 
 * @param {Object} target Object to be merged
 * @param {Function} mutation callback which goings to be used for the mutation
 * @param {Array<String>} ommit object keys to ommit into the cicle
 * @param {String} parentKey unique for recursive
 * @returns 
 */
export const mergeWithMutation = (target, { mutation, ommit = [], data }, parentKey = '') => {
  for (const key in target) {
    if (!ommit.includes(key) && typeof target[key] === 'object') {
      const keyFixed = Array.isArray(target) ? parentKey + '.' + key : key;
      const merge = mutation(keyFixed, target[key], data);
      if (merge) deepMerge(target[key], merge);
      mergeWithMutation(target[key], { mutation, ommit, data }, key);
    }
  }
  return target;
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export default function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (typeof source[key] !== 'undefined') {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}