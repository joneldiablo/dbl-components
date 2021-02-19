import urlJoin from "url-join";
import React from "react";
import PropTypes from "prop-types";
import {
  HashRouter,
  BrowserRouter,
  withRouter,
  Router,
  Route,
  Switch
} from "react-router-dom";
import { hash } from "../functions";
import DefaultView from "../views/view";
import TitleView from "../views/title-view";
import DebugView from "../views/debug-view";

const VIEWS = {
  debug: DebugView,
  TitleView,
  View: DefaultView
};

export const addViews = (viewsExtra) => {
  Object.assign(VIEWS, viewsExtra);
}

const routePropTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  name: PropTypes.string.isRequired,
  component: PropTypes.string,
  content: PropTypes.any.isRequired,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  sensitive: PropTypes.bool,
};
routePropTypes.routes = PropTypes.arrayOf(PropTypes.shape(routePropTypes));

const schemaPropTypes = {
  test: PropTypes.bool,
  theme: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.shape(routePropTypes))
}

const schemaDefaultProps = {
  routes: [],
  views: []
}

export default class SchemaController extends React.Component {

  static propTypes = schemaPropTypes;

  static defaultProps = schemaDefaultProps;

  state = {
    routeNodes: []
  }

  constructor(props) {
    super(props);
  }

  buildRoutes() {
    // crear un clone de lo que se recibe
    const schemaStr = JSON.stringify(this.props.routes);
    const routesSchema = JSON.parse(schemaStr);
    // obtener un identificador de la cadena
    this.schemaHash = hash(schemaStr);
    // se crean las rutas de forma única.
    this.setState({
      routeNodes: routesSchema.map(this.views)
    });
  }

  componentDidMount() {
    this.buildRoutes();
  }

  componentDidUpdate(prevProps, prevState) {
    // comprobar si ha cambiado el schema
    let isEq = this.schemaHash !== hash(JSON.stringify(this.props.routes));
    if (isEq) {
      this.buildRoutes();
    }
  }

  /** views
   * Método recursivo que procesa el schema de rutas
   * usar en el mapeo de un arreglo ej. routes.map(this.views)
   * permite que el schema tenga un arreglo de paths
   **/
  views = (route, i) => {
    let View = VIEWS[route.component] || (DefaultView);
    let subroutes = [];
    if (Array.isArray(route.routes)) {
      const mapRoutes = (subRoute, i) => {
        // crear un clone para no tocar el original
        subRoute = JSON.parse(JSON.stringify(subRoute));
        // si las rutas son un arreglo
        if (Array.isArray(route.path) && Array.isArray(subRoute.path)) {
          subRoute.path = subRoute.path
            .reduce((paths, path) => {
              paths.push(route.path.map(parentPath => urlJoin(parentPath, path)))
            }, []);
        } else if (Array.isArray(subRoute.path)) {
          subRoute.path = subRoute.path.map(path => urlJoin(route.path, path));
        } else if (Array.isArray(route.path)) {
          subRoute.path = route.path.map(path => urlJoin(path, subRoute.path));
        } else {
          subRoute.path = urlJoin(route.path, subRoute.path);
        }
        return this.views(subRoute, i);
      }
      subroutes = route.routes.map(mapRoutes);
    }
    // si exacto no está definido entonces true
    let exact = (typeof route.exact === 'undefined' || route.exact);
    // si hay subroutas entonces false
    exact = exact && !route.routes;

    const routeProps = {
      path: route.path,
      exact,
      strict: route.strict,
      location: route.location,
      sensitive: route.sensitive
    };
    const renderView = (props) => {
      const viewClassName = Array.from(document.body.classList)
        .find(cl => cl.endsWith('-view'));
      document.body.classList.remove(viewClassName);
      document.body.classList.add(route.name + '-view');
      return (
        <View {...route} {...props} test={this.props.test}>
          <Switch>{subroutes}</Switch>
        </View>);
    }
    return (<Route key={i + '-' + route.name} {...routeProps} render={renderView} />);
  }

  render() {
    let { history, theme } = this.props;
    let { routeNodes } = this.state;
    return (<Router history={history}>
      {theme && <link rel="stylesheet" type="text/css" href={theme} />}
      <Switch>
        {routeNodes}
      </Switch>
    </Router>);
  }
}

export const RouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return (<RController {...props} />);
}
RouterSchema.propTypes = schemaPropTypes;
RouterSchema.defaultProps = schemaDefaultProps;

export const BrowserRouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return (<BrowserRouter><RController {...props} /></BrowserRouter>);
}
BrowserRouterSchema.propTypes = schemaPropTypes;
BrowserRouterSchema.defaultProps = schemaDefaultProps;

export const HashRouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return (<HashRouter><RController {...props} /></HashRouter>);
}
HashRouterSchema.propTypes = schemaPropTypes;
HashRouterSchema.defaultProps = schemaDefaultProps;
