import resolveRefs from "dbl-components/lib/js/functions/resolve-refs";
import { iconSet } from "dbl-components/lib/js/media/icons";
import { addControllers } from "dbl-components/lib/js/controllers";
import { addComponents } from "dbl-components/lib/js/components";

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
 * @param {Object} props.views[].view
 * @param {Object} props.views[].definitions
 * @param {Object} props.state - estado inicial de la aplicación, se puede meter cualquier cosa
*/
export default class AppController {

  constructor(props) {
    if (props.icons)
      iconSet(props.icons);
    // INFO: se cargan los componentes y controladores
    addControllers(props.controllers || {});
    addComponents(props.components || {});
    // INFO: se inicializa la rootView por si no trajera la estructura adecuada
    props.rootView.definitions = props.rootView.definitions || { views: {} };
    props.rootView.definitions.views = props.rootView.definitions.views || {};
    // INFO: se cargan las vistas en rootView como definiciones
    props.views.forEach(vObj => {
      const view = resolveRefs(vObj.view, vObj);
      props.rootView.definitions.views[view.name] = view;
    });
    // INFO: se colocan las definiciones en el state para que se pueda 
    //       disponer de ellas en controladores
    state.definitions = resolveRefs(props.rootView.definitions, props.rootView);
    // INFO: se carga el estado inicial
    Object.assign(state, props.state || {});
    // INFO: se procesa la vista inicial para poder ser usada en react-route-schema
    this.root = resolveRefs(props.rootView.view, props.rootView);
    this.props = props;
  }

  setState(data) {
    Object.assign(state, data);
    Object.keys(data).forEach(key => {
      eventHandler.dispatch(key, data[key]);
    });
  }

  getState(key) {
    return state[key];
  }

  getViewDefinitions(view) {
    const viewDefinitions = {
      defs: this.props.views[view].definitions,
      definitions: this.state.definitions
    };
    return resolveRefs(viewDefinitions.defs, viewDefinitions);
  }

  get stateKeys() {
    return Object.keys(state);
  }

}