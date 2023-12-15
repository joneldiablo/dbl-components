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
    default: 'h:mm:ss A'
  },
  formatNumber: {
    default: {}
  }
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
  } else {
    if (context && config.formatTime.default[context]) return config.formatTime.default[context];
    else return config.formatTime.default;
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
  } else {
    if (context && config.formatNumber.default[context]) return config.formatNumber.default[context];
    else return config.formatNumber.default;
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
  if (config.lang === '_default') return selectFromDefault(text, context);
  const dict1 = config.dictionary[config.lang];
  if (typeof dict1 !== 'object') return selectFromDefault(text, context);
  const objContext = dict1[context];
  if (typeof objContext === 'object' && objContext[text]) return objContext[text];
  return dict1[text] || selectFromDefault(text);
};

export default t;
