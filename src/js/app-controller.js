import urlJoin from "url-join";

import {
  flatten,
  randomS4,
  resolveRefs,
  deepMerge,
  eventHandler,
  addDictionary, addFormatDate,
  addFormatNumber, addFormatTime,
  getLang, setLang, addFormatDateTime
} from "dbl-utils";

import { addIcons } from "./media/icons";
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

  eventHandler = eventHandler;
  fetchList = {};
  globalDefinitions = [];
  globalRules = [];
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
      rules = [],
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
      apiHeaders = {},
      fetchBefore = (url, options) => options,
      fetchAfter = (res) => res,
      fetchError = (error, url) => error,
      maxTimeout = 0,
      minTimeout = 1000,
      dictionary = {},
      formatDate = {},
      formatNumber = {},
      formatTime = {},
      formatDateTime = {},
      lang = 'default',
      initialState = {}
    } = props;

    this.props = {
      definitions,
      rules,
      routes,
      fields,
      components,
      controllers,
      icons,
      schema,
      api,
      apiHeaders,
      fetchBefore,
      fetchAfter,
      fetchError,
      maxTimeout,
      minTimeout,
      dictionary,
      formatDate,
      formatNumber,
      formatTime,
      formatDateTime,
      lang
    };

    if (icons) addIcons(icons);

    this.globalDefinitions.push(...(Array.isArray(definitions) ? definitions : [definitions]));
    this.globalRules.push(...(Array.isArray(rules) ? rules : [rules]));
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
    if (formatDateTime) addFormatDateTime(formatDateTime);
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
    const newRules = deepMerge({}, ...this.globalRules, schema.rules || {});
    const view = resolveRefs(schema.view, { definitions: newDefs, data: schema.data || {} }, newRules);
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
        <p class='bg-dark text-light'><pre>${JSON.stringify(schema, null, 2)}}</pre></p>
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
    return JSON.stringify(data);
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
      if (value === null)
        value = localStorage.getItem(this.prefixStorage + key);
      if (value !== null) GLOBAL_STATE[key] = this.parse(value);
    }
    return GLOBAL_STATE[key];
  }

  remove(key, { storage, dispatch = true } = {}) {
    if (storage === 'local') localStorage.removeItem(this.prefixStorage + key);
    else if (storage === 'session') sessionStorage.removeItem(this.prefixStorage + key);
    else {
      localStorage.removeItem(this.prefixStorage + key);
      sessionStorage.removeItem(this.prefixStorage + key);
    }
    GLOBAL_STATE[key] = null;
    delete GLOBAL_STATE[key];
    if (dispatch) eventHandler.dispatch('global.' + key);
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

  addHeaders(obj) {
    Object.assign(this.props.apiHeaders, obj);
  }

  removeHeaders(...headerName) {
    headerName.flat().filter(Boolean).forEach(hn => {
      this.props.apiHeaders[hn] = null;
      delete this.props.apiHeaders[hn];
    });
  }

  fetch(url, options = { method: 'GET' }) {
    options.method = options.method || 'GET';
    if (this.fetchList[options.method + url]) {
      this.fetchList[options.method + url].abort();
    }
    const { query, format = 'json',
      timeout = this.props.maxTimeout, body, headers, ...conf } = this.props.fetchBefore(url, options);
    if (body) conf.body = JSON.stringify(body);
    const fUrl = urlJoin(this.props.api, url);
    const urlFinal = new URL(fUrl);
    const flattenQuery = flatten(query || {}, { safe: true });
    Object.entries(flattenQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => urlFinal.searchParams.append(key, v));
      } else if (['number', 'boolean', 'string'].includes(typeof value)) {
        urlFinal.searchParams.set(key, value);
      }
    });

    if (timeout) {
      this.fetchList[options.method + url] = new AbortController();
      conf.signal = this.fetchList[options.method + url].signal;
    }

    const apiHeaders = !this.props.apiHeaders ? {} :
      typeof this.props.apiHeaders === 'object'
        ? this.props.apiHeaders
        : typeof this.props.apiHeaders === 'string'
        && this.props.apiHeaders.split('|').reduce((rdx, c) => {
          const [key, ...value] = c.split(':').map(s => s.trim());
          rdx[key] = value.join(':');
          return rdx;
        }, {});

    conf.headers = Object.assign({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...apiHeaders
    }, headers);
    if (timeout) {
      this.fetchList[options.method + url].timeoutId = setTimeout(this.onTimeout.bind(this), timeout, this.fetchList[options.method + url]);
    }
    const fetchPromise = fetch(urlFinal, conf)
      .then(async (r) => {
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
        e.error = true;
        if (e.name.includes('AbortError') && abortCtrl.timeout) {
          const et = new Error('timeout');
          et.error = true;
          return this.props.fetchError(et, url);
        }
        console.error(e);
        return this.props.fetchError(e, url);
      })
      .then(this.props.fetchAfter)
      .finally(() => {
        if (timeout)
          clearTimeout(this.fetchList[options.method + url].timeoutId);
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