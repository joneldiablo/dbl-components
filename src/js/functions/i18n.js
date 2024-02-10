import moment from "moment";

import deepMerge from "./deep-merge";

/**
 * Configuration object for text translation.
 * @type {Object}
 * @property {string} lang - The current language.
 * @property {Object} dictionary - The dictionary of translations.
 * @property {Object} dictionary.default - The default translation dictionary.
 */
const config = {
  lang: '_default',
  dictionary: {
    default: {}
  },
  formatDate: {
    default: 'MM/DD/YYYY'
  },
  formatTime: {
    default: 'HH:mm:ss'
  },
  formatDateTime: {
    default: 'MM/DD/YYYY HH:mm:ss'
  },
  formatNumber: {
    default: {
    }
  },
  formatCurrency: {
    default: {
      currency: 'USD',
      style: 'currency'
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  globalThis.textsFounded = new Set();
}

/**
 * Adds a dictionary to the configuration object.
 * @param {Object} dictionary - The dictionary to add.
 * @returns {boolean} Returns true if the dictionary was added correctly, otherwise returns false.
 */
export const addDictionary = (dictionary) => {
  if (typeof dictionary !== 'object') return false;
  deepMerge(config.dictionary, dictionary);
  return true;
}

/**
 * Adds date formats to the configuration object.
 * @param {Object} formats - The date formats to add.
 * @returns {boolean} Returns true if the date formats were added correctly, otherwise returns false.
 */
export const addFormatDate = (formats) => {
  if (typeof formats !== 'object') return false;
  deepMerge(config.formatDate, formats);
  return true;
}

/**
 * Adds time formats to the configuration object.
 * @param {Object} formats - The time formats to add.
 * @returns {boolean} Returns true if the time formats were added correctly, otherwise returns false.
 */
export const addFormatTime = (formats) => {
  if (typeof formats !== 'object') return false;
  deepMerge(config.formatTime, formats);
  return true;
}

/**
 * Adds date-time formats to the configuration object.
 * @param {Object} formats - The date-time formats to add.
 * @returns {boolean} Returns true if the date-time formats were added correctly, otherwise returns false.
 */
export const addFormatDateTime = (formats) => {
  if (typeof formats !== 'object') return false;
  deepMerge(config.formatDateTime, formats);
  return true;
}

/**
 * Adds number formats to the configuration object.
 * @param {Object} formats - The number formats to add.
 * @returns {boolean} Returns true if the number formats were added correctly, otherwise returns false.
 */
export const addFormatNumber = (formats) => {
  if (typeof formats !== 'object') return false;
  deepMerge(config.formatNumber, formats);
  return true;
}

/**
 * Adds currency formats to the configuration object.
 * @param {Object} formats - The currency formats to add.
 * @returns {boolean} Returns true if the currency formats were added correctly, otherwise returns false.
 */
export const addFormatCurrency = (formats) => {
  if (typeof formats !== 'object') return false;
  Object.values(formats).forEach(f => (f.style = 'currency'));
  deepMerge(config.formatCurrency, formats);
  return true;
}


/**
 * Sets the current language.
 * @param {string} newLang - The new language to set.
 * @returns {boolean} Returns true if the new language was set correctly, otherwise returns false.
 */
export const setLang = (newLang) => {
  if (!newLang || config.lang === newLang) return false;
  moment.locale(newLang);
  config.lang = newLang;
  return true;
};

/**
 * Gets the current language.
 * @returns {string} The current language.
 */
export const getLang = () => {
  return config.lang;
}

/**
 * Formats a date according to the current language and context.
 * @param {string} context - The context of the date.
 * @returns {string} The formatted date.
 */
export const formatDate = (context) => {
  if (config.lang !== '_default' && config.formatDate[config.lang]) {
    if (context && config.formatDate[config.lang][context]) return config.formatDate[config.lang][context];
    else return config.formatDate[config.lang];
  } else if (config.formatDate[context]) {
    return config.formatDate[context];
  } else {
    if (context && config.formatDate.default[context]) return config.formatDate.default[context];
    else return config.formatDate.default;
  }
}

/**
 * Formats a time according to the current language and context.
 * @param {string} context - The context of the time.
 * @returns {string} The formatted time.
 */
export const formatTime = (context) => {
  if (config.lang !== '_default' && config.formatTime[config.lang]) {
    if (context && config.formatTime[config.lang][context]) return config.formatTime[config.lang][context];
    else return config.formatTime[config.lang];
  } else if (config.formatTime[context]) {
    return config.formatTime[context];
  } else {
    if (context && config.formatTime.default[context]) return config.formatTime.default[context];
    else return config.formatTime.default;
  }
}

/**
 * Formats a date-time according to the current language and context.
 * @param {string} context - The context of the date-time.
 * @returns {string} The formatted date-time.
 */
export const formatDateTime = (context) => {
  if (config.lang !== '_default' && config.formatDateTime[config.lang]) {
    if (context && config.formatDateTime[config.lang][context]) return config.formatDateTime[config.lang][context];
    else return config.formatDateTime[config.lang];
  } else if (config.formatDateTime[context]) {
    return config.formatDateTime[context];
  } else {
    if (context && config.formatDateTime.default[context]) return config.formatDateTime.default[context];
    else return config.formatDateTime.default;
  }
}

/**
 * Formats a number according to the current language and context.
 * @param {string} context - The context of the number.
 * @returns {string} The formatted number.
 */
export const formatNumber = (context) => {
  if (config.lang !== '_default' && config.formatNumber[config.lang]) {
    if (context && config.formatNumber[config.lang][context]) return config.formatNumber[config.lang][context];
    else return config.formatNumber[config.lang];
  } else if (config.formatNumber[context]) {
    return config.formatNumber[context];
  } else {
    if (context && config.formatNumber.default[context]) return config.formatNumber.default[context];
    else return config.formatNumber.default;
  }
}

/**
 * Formats a currency according to the current language and context.
 * @param {string} context - The context of the currency.
 * @returns {string} The formatted currency.
 */
export const formatCurrency = (context) => {
  if (config.lang !== '_default' && config.formatCurrency[config.lang]) {
    if (context && config.formatCurrency[config.lang][context]) return config.formatCurrency[config.lang][context];
    else return config.formatCurrency[config.lang];
  } else if (config.formatCurrency[context]) {
    return config.formatCurrency[context];
  } else {
    if (context && config.formatCurrency.default[context]) return config.formatCurrency.default[context];
    else return config.formatCurrency.default;
  }
}

/**
 * Selects a text from the default dictionary.
 * @param {string} text - The text to select.
 * @param {string} context - The context of the text.
 * @returns {string} The selected text from the default dictionary.
 */
const selectFromDefault = (text, context) => {
  const dictDefault = config.dictionary.default;
  if (typeof dictDefault[context] === 'object' && dictDefault[context][text])
    return dictDefault[context][text];
  return dictDefault[text] || text;
}

/**
 * Function to translate texts.
 * @param {string} text - The text to translate.
 * @param {string} context - The context of the text.
 * @returns {string} The translated text.
 */
const t = (text, context) => {
  if (process.env.NODE_ENV === 'development') {
    globalThis.textsFounded.add(text);
  }
  if (config.lang === '_default') return selectFromDefault(text, context);
  const dict1 = config.dictionary[config.lang];
  if (typeof dict1 !== 'object') return selectFromDefault(text, context);
  const objContext = dict1[context];
  if (typeof objContext === 'object' && objContext[text]) return objContext[text];
  return dict1[text] || selectFromDefault(text);
};

export default t;
