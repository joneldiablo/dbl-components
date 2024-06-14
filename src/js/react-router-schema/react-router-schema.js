import urlJoin from "url-join";
import React from "react";
import PropTypes from "prop-types";
import {
  HashRouter,
  BrowserRouter,
  withRouter,
  Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import stringify from "../functions/stringify";

import { hash } from "../functions";
import controllers from "../controllers";

const routePropTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  content: PropTypes.any.isRequired,
  name: PropTypes.string,
  component: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  sensitive: PropTypes.bool,
  redirect: PropTypes.string,
  routes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(this)),
    PropTypes.shape(this)
  ])
};

const schemaPropTypes = {
  test: PropTypes.bool,
  theme: PropTypes.string,
  routes: routePropTypes.routes,
  redirect: PropTypes.func,
  defaultController: PropTypes.func,
  history: PropTypes.any,
  Router: PropTypes.elementType
}

const schemaDefaultProps = {
  routes: [],
  defaultController: controllers.Controller
}
const routeComponents = {
  Route
}
export const AddRouteComponents = (nrc) => {
  Object.assign(routeComponents, nrc);
}

export default class SchemaController extends React.Component {

  static jsClass = 'SchemaController';
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
    const schemaStr = stringify(this.props.routes);
    const routesSchema = JSON.parse(schemaStr);
    // se crean las rutas de forma única.
    let routes;
    if (Array.isArray(routesSchema))
      routes = routesSchema.map(this.views);
    else if (typeof routesSchema === 'object' && routesSchema.name)
      routes = this.views(routesSchema);
    else if (typeof routesSchema === 'object')
      routes = Object.keys(routesSchema)
        .map((name, i) => this.views({ name, ...routesSchema[name] }, i))
    this.setState({
      routeNodes: routes
    });
  }

  componentDidMount() {
    this.buildRoutes();
  }

  componentDidUpdate(prevProps, prevState) {
    // comprobar si ha cambiado el schema
    let newHash = hash(stringify(this.props.routes));
    if (this.routesHash !== newHash) {
      this.buildRoutes();
      this.routesHash = newHash;
    }
  }

  /** views
   * Método recursivo que procesa el schema de rutas
   * usar en el mapeo de un arreglo ej. routes.map(this.views)
   * permite que el schema tenga un arreglo de paths
   **/
  views = (route, i) => {
    const Controller = controllers[route.component] || this.props.defaultController || controllers.Controller;
    let subroutes = false;
    if (Array.isArray(route.routes)) subroutes = [];
    else if (typeof route.routes === 'object') {
      subroutes = [];
      route.routes = Object.keys(route.routes)
        .map(name => ({ name, ...route.routes[name] }));
    }
    if (subroutes) {
      const mapRoutes = (subRoute, i) => {
        // crear un clone para no tocar el original
        subRoute = JSON.parse(stringify(subRoute));
        // si las rutas son un arreglo
        if (Array.isArray(route.path) && Array.isArray(subRoute.path)) {
          subRoute.path = subRoute.path.reduce((paths, path) => {
            paths.push(route.path.map(parentPath => urlJoin(parentPath, path)));
            return paths;
          }, []);
        } else if (Array.isArray(subRoute.path)) {
          subRoute.path = subRoute.path.map(path => urlJoin(route.path, path));
        } else if (Array.isArray(route.path)) {
          subRoute.path = route.path.map(path => urlJoin(path, subRoute.path));
        } else {
          subRoute.path = urlJoin(route.path, subRoute.path || '');
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
    const RedirViewManager = (props) => {
      let redirTo = typeof this.props.redirect === 'function' &&
        this.props.redirect(props.location);

      if (redirTo)
        return React.createElement(Redirect,
          {
            to: {
              pathname: redirTo,
              state: { from: props.location }
            }
          }
        )
      const viewClassName = Array.from(document.body.classList)
        .find(cl => cl.endsWith('-view'));
      document.body.classList.remove(viewClassName);
      document.body.classList.add(route.name + '-view');
      document.body.classList.forEach(cls => {
        if (cls.startsWith('location-')) document.body.classList.remove(cls);
      });
      document.body.classList.add('location' + props.location.pathname.replace(/\//g, '-'));
      const useSwitch = (typeof route.useSwitch === 'undefined' || route.useSwitch);
      if (!route.style) route.style = {};
      route.style['--component-name'] = `"${route.name}"`;
      return (React.createElement(Controller,
        { ...route, ...props, test: this.props.test },
        useSwitch
          ? React.createElement(Switch, {}, subroutes)
          : subroutes
      ));
    }
    const key = i || typeof i === 'number' ? (i + '-' + route.name) : route.name;
    const TheRoute = routeComponents[route.RouteComponent] || routeComponents.Route;
    return React.createElement(TheRoute, { key, ...routeProps, render: RedirViewManager });
  }

  render() {
    let { history, theme, Router: OtherRouter } = this.props;
    let { routeNodes } = this.state;
    return (React.createElement(OtherRouter || Router,
      { history },
      theme && React.createElement('link', { rel: "stylesheet", type: "text/css", href: theme }),
      React.createElement(Switch, {}, routeNodes)
    ));
  }
}

export const RouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return React.createElement(RController, { ...props });
}
RouterSchema.propTypes = schemaPropTypes;
RouterSchema.defaultProps = schemaDefaultProps;

export const BrowserRouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return React.createElement(BrowserRouter, {}, React.createElement(RController, { ...props }));
}
BrowserRouterSchema.propTypes = schemaPropTypes;
BrowserRouterSchema.defaultProps = schemaDefaultProps;

export const HashRouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return React.createElement(HashRouter, {}, React.createElement(RController, { ...props }));
}
HashRouterSchema.propTypes = schemaPropTypes;
HashRouterSchema.defaultProps = schemaDefaultProps;
