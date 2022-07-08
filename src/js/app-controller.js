import { flatten } from "flat";

import resolveRefs from "./functions/resolve-refs";
import { iconSet } from "./media/icons";
import { addControllers } from "./controllers";
import { addComponents } from "./components";
import eventHandler from "./functions/event-handler";

const state = {};

/**
 * @param {Object} props - Propiedades de la aplicación
 * @param {Object} props.icons - Archivo IcoMoon que registra todos los íconos
 * @param {Object} props.controllers - listado de los controladores personalizados
 * @param {Object} props.components - listado de componentes personalizados
 * @param {Object} props.rootView - vista inicial (archivo json), debe tener path:"/"
 * @param {Object} props.rootView.view - objeto donde se registra la estructura de la página
 * @param {Object} props.rootView.definitions - objeto con estructuras que se podrán reciclar
 * @param {Object[]} props.views - arreglo de vistas con la misma estructura que rootview
 * @param {Object} props.containers - nombre de contenedores extra ej. {containers:'container'}
 * @param {Object} props.views[].view
 * @param {Object} props.views[].definitions
 * @param {Object} props.state - estado inicial de la aplicación, se puede meter cualquier cosa
*/
export default class AppController {

  fetchList = {};

  constructor(props) {
    if (props.icons)
      iconSet(props.icons);
    // INFO: se cargan los componentes y controladores
    addControllers(props.controllers || {});
    addComponents(props.components || {});
    // INFO: se inicializa la rootView por si no trajera la estructura adecuada
    props.rootView.definitions = props.rootView.definitions || { views: {} };
    props.rootView.definitions.views = props.rootView.definitions.views || {};
    // INFO: se cargan las vistas en rootView como definiciones y otros contenedores
    props.views.forEach(vObj => {
      props.containers = props.containers || {};
      vObj.definitions = Object.assign({}, props.rootView.definitions, vObj.definitions);
      Object.entries(props.containers).forEach(([containerName, elementName]) => {
        if (!vObj[elementName]) return;
        const content = resolveRefs(vObj[elementName], vObj);
        if (!props.rootView.definitions[containerName])
          props.rootView.definitions[containerName] = {};
        props.rootView.definitions[containerName][content.name] = content;
      });
      const view = resolveRefs(vObj.view, vObj);
      props.rootView.definitions.views[view.name] = view;
    });
    // INFO: se carga el estado inicial
    Object.assign(state, props.state || {});
    // INFO: se procesa la vista inicial para poder ser usada en react-route-schema
    this.root = resolveRefs(props.rootView.view, props.rootView);
    if (typeof props.fetchError !== 'function')
      props.fetchError = r => r;
    if (typeof props.fetchBefore !== 'function')
      props.fetchBefore = (url, opts) => opts;
    if (typeof props.api !== 'string')
      props.api = '//api';
    this.props = props;
  }

  setState(data, dispatch = true) {
    Object.assign(state, data);
    Object.keys(data).forEach(key => {
      if (dispatch) eventHandler.dispatch('global.' + key, data[key]);
    });
  }

  getState(key) {
    return state[key];
  }

  getViewDefinitions(name) {
    const viewWrap = this.props.views.find(({ view }) => view.name === name);
    const viewDefinitions = {
      defs: viewWrap.definitions,
      definitions: state.definitions
    };
    return {
      ...state.definitions,
      ...resolveRefs(viewDefinitions.defs, viewDefinitions)
    };
  }

  get stateKeys() {
    return Object.keys(state);
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
    const timeoutId = setTimeout(this.onTimeout, timeout, controller);
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

  onTimeout = (controller) => {
    controller.timeout = true;
    controller.abort();
  }

}