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

const routePropTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  view: PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired
  }).isRequired,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  sensitive: PropTypes.bool,
};
routePropTypes.routes = PropTypes.arrayOf(PropTypes.shape(routePropTypes));

const schemaPropTypes = {
  views: PropTypes.arrayOf(PropTypes.elementType),
  routes: PropTypes.arrayOf(PropTypes.shape(routePropTypes))
}

const schemaDefaultProps = {
  routes: [],
  views: []
}

const NotFoundView = ({ children, ...props }) => {
  return (<div style={{ display: 'flex', border: '1px solid', padding: 5, margin: 2 }}>
    <div>
      <p>View "{props.name}" not found.</p>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    </div>
    <div>
      {children}
    </div>
  </div>);
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
    const routesSchema = JSON.parse(JSON.stringify(this.props.routes));
    // se crean las rutas de forma única.
    // no se permite crearlas en cada render
    // no se cargan en vista por tanto no es necesario hacerlo en didmount
    this.setState({
      routeNodes: routesSchema.map(this.views)
    });
  }

  componentDidMount() {
    this.buildRoutes();
  }

  componentDidUpdate(prevProps, prevState) {
    let isEq = JSON.stringify(prevProps.routes) !== JSON.stringify(this.props.routes);
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
    let View = this.props.views[route.view.name] || (NotFoundView);
    let subroutes = [];
    if (Array.isArray(route.routes)) {
      subroutes = route.routes.map((subRoute, i) => {
        // crear un clone para no tocar el original
        subRoute = JSON.parse(JSON.stringify(subRoute));
        subRoute.path = urlJoin(route.path, subRoute.path);
        return this.views(subRoute, i);
      });
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
    const viewProps = {
      ...route.view,
      histoy: this.props.history,
      match: this.props.match,
      location: this.props.location
    };
    return (<Route key={i} {...routeProps} >
      <View {...viewProps}>
        <Switch>{subroutes}</Switch>
      </View>
    </Route>);
  }

  render() {
    let { history } = this.props;
    let { routeNodes } = this.state;
    return (<Router history={history}>
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