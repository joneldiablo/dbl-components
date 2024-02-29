import { flatten } from "flat";

import defaultIcons from "../app-icons-v1.0/selection.json";
import { randomS4 } from "./functions";
import stringify from "./functions/stringify";
import resolveRefs from "./functions/resolve-refs";
import deepMerge from "./functions/deep-merge";
import eventHandler from "./functions/event-handler";
import {
  addDictionary, addFormatDate,
  addFormatNumber, addFormatTime,
  getLang, setLang,
} from "./functions/i18n";

import { addIcons, setIconSet } from "./media/icons";
import { addComponents } from "./components";
import { addControllers } from "./controllers";
import { addFields } from "./forms/fields";

const GLOBAL_STATE = {};

/**
 * @param {Object} props - Propiedades de la aplicación
 * @param {Object} props.icons - Archivo IcoMoon que registra todos los íconos
 * @param {Object} props.controllers - listado de los controladores personalizados
 * @param {Object} props.components - listado de componentes personalizados
 * @param {Array|Object} props.definitions - global definitions 
 * @param {Object[]} props.routes - array of routes
 * @param {Object} props.schema - initial schema, the app root
*/
export class AppController {

  fetchList = {};
  globalDefinitions = [];
  routes = {};
  tmpRoutesFound = 0;
  rootSchema;
  random = randomS4();
  props;
  prefixStorage = '_gs.';

  constructor(props = false) {
    if (props) this.init(props);
  }

  init(props = {}) {
    const {
      definitions = [],
      routes = [],
      fields = {},
      components = {},
      controllers = {},
      icons = false,
      schema = {
        view: {
          name: 'appEmpty',
          path: '/',
          content: 'Root empty site'
        }
      },
      api = "http://localhost:3000/",
      apiHeaders,
      fetchBefore = (url, options) => options,
      fetchError = (error, url) => error,
      maxTimeout = 30000,
      minTimeout = 300,
      dictionary = {},
      formatDate = {},
      formatNumber = {},
      formatTime = {},
      lang = 'default',
      initialState = {}
    } = props;

    this.props = {
      definitions,
      routes,
      fields,
      components,
      controllers,
      icons,
      schema,
      api,
      apiHeaders,
      fetchBefore,
      fetchError,
      maxTimeout,
      minTimeout,
      dictionary,
      formatDate,
      formatNumber,
      formatTime,
      lang
    };

    const copyIcons = JSON.parse(stringify(defaultIcons));
    setIconSet(copyIcons);
    if (icons) addIcons(icons);

    this.globalDefinitions.push(...(Array.isArray(definitions) ? definitions : [definitions]));
    this.routes = routes.reduce((rdx, route) => {
      if (rdx[route.view.name]) console.warn(`Route was ${route.view.name} overwrited`);
      rdx[route.view.name] = route;
      return rdx;
    }, {});

    if (fields) addFields(fields);
    if (components) addComponents(components);
    if (controllers) addControllers(controllers);
    if (dictionary) addDictionary(dictionary);
    if (formatDate) addFormatDate(formatDate);
    if (formatNumber) addFormatNumber(formatNumber);
    if (formatTime) addFormatTime(formatTime);
    if (lang) setLang(lang);
    if (initialState) {

      const keys = [
        ...Object.keys(sessionStorage),
        ...Object.keys(localStorage)
      ]
        .filter(k => k.startsWith(this.prefixStorage))
        .map(k => k.replace(this.prefixStorage, ''));

      Object.entries(initialState).forEach(([key, value]) => {
        if (keys.includes(key)) this.get(key);
        else GLOBAL_STATE[key] = value;
      });
    }

    schema.path = schema.path || '/';
    this.rootSchema = this.buildRootSchema(schema);
    console.info('Total Routes:', this.tmpRoutesFound);
  }

  findingRoutesRecursive(schema) {
    this.tmpRoutesFound++;
    const newDefs = deepMerge({}, ...this.globalDefinitions, schema.definitions || {});
    const view = resolveRefs(schema.view, { definitions: newDefs, data: schema.data || {} });
    if (schema.routes?.length)
      view.routes = Object.entries(resolveRefs(schema.routes, { routes: this.routes })).map(([key, route]) => {
        if (!(route && route.view)) {
          console.error('ROUTE VIEW (route.view) NOT FOUND', route);
          return {
            name: view.name + '.' + key,
            path: `/${view.name}-${key}`,
            tag: 'error',
            content: `
        <p class='text-danger'>NOT FOUND</p>
        <p class='bg-dark text-light'><pre>${stringify(schema, null, 2)}}</pre></p>
        `
          };
        }
        return this.findingRoutesRecursive(route);
      });
    return view;
  };

  buildRootSchema(schema) {
    this.tmpRoutesFound = 0;
    const root = this.findingRoutesRecursive(schema);
    console.info('Total Routes:', this.tmpRoutesFound);
    return root;
  }

  stringify(data, encrypt) {
    //TODO: encrypt data y agregar un uno (1::) al principio, para saber que es una cadena encriptada
    return stringify(data);
  }

  parse(data) {
    //TODO: revisar que sea una string que inicia con un uno (1::) si sí desencriptar, sino, solo devolver
    return JSON.parse(data);
  }

  set(key, data, { dispatch = true, storage = 'local', encrypt = false } = {}) {
    if (storage === 'local') localStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
    else if (storage === 'session') sessionStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
    GLOBAL_STATE[key] = data;
    if (dispatch) eventHandler.dispatch('global.' + key, data);
  }

  get(key) {
    if (GLOBAL_STATE[key] === undefined) {
      let value = sessionStorage.getItem(this.prefixStorage + key);
      if (value === undefined)
        value = localStorage.getItem(this.prefixStorage + key);
      if (value !== undefined) GLOBAL_STATE[key] = this.parse(value);
    }
    return GLOBAL_STATE[key];
  }

  remove(key, { storage = 'local' }) {
    if (storage === 'local') localStorage.removeItem(key);
    else if (storage === 'session') sessionStorage.removeItem(key);
    delete GLOBAL_STATE[key];
  }

  getRootDefinitions() {
    const allDefs = deepMerge({}, ...this.globalDefinitions, this.rootSchema.definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  getViewDefinitions(name) {
    if (!this.routes[name]?.definitions) return {};
    const allDefs = deepMerge({}, ...this.globalDefinitions, this.routes[name].definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  getGlobalDefinitions() {
    return this.globalDefinitions;
  }

  getGlobalKeys() {
    return Object.keys(GLOBAL_STATE);
  }

  async minTimeout(promise, timeout = this.props.minTimeout) {
    const [r] =
      await Promise.all([promise, new Promise((resolve) => setTimeout(resolve, timeout, true))]);
    return r;
  }

  fetch(url, options = { method: 'GET' }) {
    options.method = options.method || 'GET';
    if (this.fetchList[options.method + url]) {
      this.fetchList[options.method + url].abort();
    }
    const { query, format = 'json',
      timeout = this.props.maxTimeout, body, headers, ...conf } = this.props.fetchBefore(url, options);
    if (body) conf.body = stringify(body);
    const urlFinal = new URL(url, this.props.api);
    const flattenQuery = flatten(query || {}, { safe: true });
    Object.entries(flattenQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => urlFinal.searchParams.append(key, v));
      } else if (['number', 'boolean', 'string'].includes(typeof value)) {
        urlFinal.searchParams.set(key, value);
      }
    });
    const controller = new AbortController();
    this.fetchList[options.method + url] = controller;

    const apiHeaders = !this.props.apiHeaders ? {} :
      typeof this.props.apiHeaders === 'object'
        ? this.props.apiHeaders
        : typeof this.props.apiHeaders === 'string'
        && this.props.apiHeaders.split('|').reduce((rdx, c) => {
          const [key, ...value] = c.split(':').map(s => s.trim());
          rdx[key] = value.join(':');
          return rdx;
        }, {});

    conf.signal = controller.signal;
    conf.headers = Object.assign({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...apiHeaders
    }, headers);
    const timeoutId = setTimeout(this.onTimeout.bind(this), timeout, controller);
    const fetchPromise = fetch(urlFinal, conf)
      .then(async (r) => {
        clearTimeout(timeoutId);
        delete this.fetchList[options.method + url];
        if (!r.ok) {
          const e = new Error(r.statusText);
          e.status = r.status;
          const j = await r.json();
          Object.assign(e, j);
          throw e;
        }
        return format === 'raw' ? r : r[format]();
      })
      .catch(e => {
        console.error(e);
        e.error = true;
        if (e.name.includes('AbortError') && controller.timeout) {
          const et = new Error('timeout');
          et.error = true;
          return this.props.fetchError(et, url);
        }
        return this.props.fetchError(e, url);
      });
    return this.minTimeout(fetchPromise);
  }

  onTimeout(controller) {
    controller.timeout = true;
    controller.abort();
  }

  getLang() {
    return getLang();
  }

  setLang = (lang) => {
    this.props.lang = lang;
    setLang(lang);
    if (typeof this.update === 'function') this.update(randomS4());
  }

  setUpdate(update) {
    this.update = update;
  }

}

export default new AppController();