import { flatten } from "flat";

import resolveRefs from "./functions/resolve-refs";
import deepMerge from "./functions/deep-merge";
import eventHandler from "./functions/event-handler";
import { addIcons, setIconSet } from "./media/icons";
import { addControllers } from "./controllers";
import { addComponents } from "./components";
import { addFields } from "./forms/fields";
import defaultIcons from "../app-icons-v1.0/selection.json";
import { randomS4 } from "./functions";

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
export default class AppController {

  fetchList = {};
  globalDefinitions = [];
  routes = {};
  tmpRoutesFound = 0;
  rootSchema;
  random = randomS4();


  constructor(props = {}) {
    const {
      definitions = [],
      routes = [{ name: 'addRoutes', content: 'Please add routes', path: '/' }],
      fields = {},
      components = {},
      controllers = {},
      icons = false,
      schema = { name: 'appEmpty', content: 'Hello world' }
    } = props;

    const copyIcons = JSON.parse(JSON.stringify(defaultIcons));
    setIconSet(copyIcons);
    if (icons) addIcons(icons);

    this.globalDefinitions.push(...(Array.isArray(definitions) ? definitions : [definitions]));
    this.routes = routes.reduce((rdx, route) => {
      if (rdx[route.view.name]) console.warn(`Route was ${route.view.name} overwrited`);
      rdx[route.view.name] = route;
      return rdx;
    }, {});

    addFields(fields);
    addComponents(components);
    addControllers(controllers);

    this.rootSchema = this.buildRootSchema(schema);

    console.info('Total Routes:', this.tmpRoutesFound);
  }

  findingRoutesRecursive(schema) {
    this.tmpRoutesFound++;
    const newDefs = deepMerge({}, ...this.globalDefinitions, schema.definitions || {});
    const view = resolveRefs(schema.view, { definitions: newDefs });
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
    if (storage === 'local') localStorage.setItem(key, this.stringify(data, encrypt));
    else if (storage === 'session') sessionStorage.setItem(key, this.stringify(data, encrypt));
    GLOBAL_STATE[key] = data;
    if (dispatch) eventHandler.dispatch('global.' + key, data);
  }

  get(key) {
    if (GLOBAL_STATE[key] === undefined) {
      let value = sessionStorage.getItem(key);
      if (value === undefined)
        value = localStorage.getItem(key);
      if (value !== undefined) GLOBAL_STATE[key] = this.parse(value);
    }
    return GLOBAL_STATE[key];
  }

  remove(key, { storage = 'local' }) {
    if (storage === 'local') localStorage.removeItem(key);
    else if (storage === 'session') sessionStorage.removeItem(key);
    delete GLOBAL_STATE[key];
  }

  getViewDefinitions(name) {
    return this.routes[name].definitions;
  }

  getGlobalDefinitions() {
    return this.globalDefinitions;
  }

  getGlobalKeys() {
    return Object.keys(GLOBAL_STATE);
  }

  async minTimeout(promise, timeout = 300) {
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
      timeout = 30000, body, headers, ...conf } = this.props.fetchBefore(url, options);
    if (body) conf.body = JSON.stringify(body);
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
    conf.signal = controller.signal;
    conf.headers = Object.assign({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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

}