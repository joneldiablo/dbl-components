import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import { hash, eventHandler } from "dbl-utils";

import controllers from "../controllers";
import withRouteWrapper from "./with-route-wrapper";

const routePropTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  content: PropTypes.any.isRequired,
  name: PropTypes.string,
  component: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  location: PropTypes.object,
  sensitive: PropTypes.bool,
  routes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(this)),
    PropTypes.shape(this),
  ]),
};

const schemaPropTypes = {
  test: PropTypes.bool,
  theme: PropTypes.string,
  routes: routePropTypes.routes,
  defaultController: PropTypes.func,
  forceRebuild: PropTypes.bool,
};

const schemaDefaultProps = {
  routes: [],
  defaultController: controllers.Controller,
};

export default class SchemaController extends React.Component {
  static jsClass = "SchemaController";
  static propTypes = schemaPropTypes;
  static defaultProps = schemaDefaultProps;

  routeNodes = [];
  state = {};

  constructor(props) {
    super(props);
    this.routesHash = "";
    this.buildRoutes();
  }

  buildRoutes() {
    // Crear un clone de lo que se recibe
    const schemaStr = JSON.stringify(this.props.routes);
    const routesSchema = JSON.parse(schemaStr);

    let routes;
    if (Array.isArray(routesSchema)) routes = routesSchema.map(this.views);
    else if (typeof routesSchema === "object" && routesSchema.name)
      routes = this.views(routesSchema);
    else if (typeof routesSchema === "object")
      routes = Object.keys(routesSchema).map((name, i) =>
        this.views({ name, ...routesSchema[name] }, i)
      );

    //asignación directa
    this.routeNodes = routes;
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    // Rebuild routes when the schema changes or forceRebuild is toggled
    const currentHash = hash(JSON.stringify(this.props.routes));
    const schemaChanged = this.routesHash !== currentHash;
    const forceToggled = this.props.forceRebuild && this.props.forceRebuild !== prevProps.forceRebuild;
    if (schemaChanged || forceToggled) {
      this.buildRoutes();
      this.routesHash = currentHash;
    }
  }

  /** views
   * Método recursivo que procesa el schema de rutas
   * usar en el mapeo de un arreglo ej. routes.map(this.views)
   * permite que el schema tenga un arreglo de paths
   **/
  views = (route, i, depth = 0) => {
    // Ensure nested routes use relative paths (no leading slash)
    if (depth > 0 && typeof route.path === 'string') {
      route.path = route.path.replace(/^\/+/, '');
    }
    const Controller =
      controllers[route.component] ||
      this.props.defaultController ||
      controllers.Controller;
    route.test = route.test || this.props.test;
    const WrappedController = withRouteWrapper(Controller, route);

    let subroutes = false;

    if (Array.isArray(route.routes)) subroutes = [];
    else if (typeof route.routes === "object") {
      subroutes = [];
      route.routes = Object.keys(route.routes).map((name) => ({
        name,
        ...route.routes[name],
      }));
    }

    if (subroutes) {
      const mapRoutes = (subRoute, idx) => {
        const childSchema = JSON.parse(JSON.stringify(subRoute));
        return this.views(childSchema, idx, depth + 1);
      };
      subroutes = route.routes.map(mapRoutes);
    }

    const routeProps = {
      path: route.path,
      index: route.index,

      action: route.action,
      caseSensitive: route.caseSensitive,
      Component: route.Component,
      ErrorBoundary: route.ErrorBoundary,
      errorElement: route.errorElement,
      handle: route.handle,
      hasErrorBoundary: route.hasErrorBoundary,
      HydrateFallback: route.HydrateFallback,
      hydrateFallbackElement: route.hydrateFallbackElement,
      id: route.id,
      lazy: route.lazy,
      loader: route.loader,
      shouldRevalidate: route.shouldRevalidate,

      element: (
        <WrappedController {...route}>
          {subroutes.length > 0 ? <Outlet /> : null}
        </WrappedController>
      ),
    };

    const key = i || typeof i === "number" ? i + "-" + route.name : route.name;

    return (
      <Route key={key} {...routeProps}>
        {subroutes.length > 0 && subroutes}
      </Route>
    );
  };

  render() {
    const { theme } = this.props;
    return (
      <>
        {!!theme && <link rel="stylesheet" type="text/css" href={theme} />}
        <Routes>{this.routeNodes}</Routes>
      </>
    );
  }
}

const RouterSchema = (props) => {
  const location = useLocation();
  useEffect(() => {
    eventHandler.dispatch("location", location);
  }, [location.pathname]);
  return <SchemaController {...props} />;
};

export const BrowserRouterSchema = (incomingProps) => {
  const props = { ...schemaDefaultProps, ...incomingProps };
  return (
    <BrowserRouter>
      <RouterSchema {...props} />
    </BrowserRouter>
  );
};
BrowserRouterSchema.propTypes = schemaPropTypes;

export const HashRouterSchema = (incomingProps) => {
  const props = { ...schemaDefaultProps, ...incomingProps };
  return (
    <HashRouter>
      <RouterSchema {...props} />
    </HashRouter>
  );
};
HashRouterSchema.propTypes = schemaPropTypes;
