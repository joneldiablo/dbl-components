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
};

const schemaDefaultProps = {
  routes: [],
  defaultController: controllers.Controller,
};

/**
 * Controller that renders a React Router `<Routes>` tree from a schema.
 *
 * @example
 * ```jsx
 * <BrowserRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export default class SchemaController extends React.Component {
  static jsClass = "SchemaController";
  static propTypes = schemaPropTypes;
  static defaultProps = schemaDefaultProps;

  routeNodes = [];
  state = {};

  constructor(props) {
    super(props);
    this.routesHash = hash(JSON.stringify(props.routes));
    this.buildRoutes();
  }

  /**
   * Builds the route elements from the provided schema and updates the hash used
   * to detect changes between renders.
   *
   * @private
   */
  buildRoutes() {
    // Create a clone of the incoming routes
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

    // Direct assignment
    this.routeNodes = routes;
    this.routesHash = hash(JSON.stringify(this.props.routes));
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the schema has changed
    const newHash = hash(JSON.stringify(this.props.routes));
    if (this.routesHash !== newHash) {
      this.buildRoutes();
      this.forceUpdate();
    }
  }

  /**
   * Recursively processes a route definition and returns a React Router `<Route>`
   * element. Intended to be used as a callback, for example
   * `routes.map(this.views)`.
   *
   * @param {Object} route - Route definition.
   * @param {number} [i] - Index of the current route.
   * @returns {JSX.Element} The generated `<Route>` element.
   */
  views = (route, i) => {
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
      const mapRoutes = (subRoute, i) => {
        subRoute = JSON.parse(JSON.stringify(subRoute));
        return this.views(subRoute, i);
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

/**
 * Internal wrapper that dispatches location changes and renders the schema
 * controller.
 *
 * @param {Object} props - Props passed to {@link SchemaController}.
 * @returns {JSX.Element} The rendered controller.
 */
const RouterSchema = (props) => {
  const location = useLocation();
  useEffect(() => {
    eventHandler.dispatch("location", location);
  }, [location.pathname]);
  return <SchemaController {...props} />;
};

/**
 * Renders the schema inside a {@link BrowserRouter}.
 *
 * @param {Object} incomingProps - Props containing the route schema.
 * @returns {JSX.Element} The browser router with the schema.
 *
 * @example
 * ```jsx
 * <BrowserRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export const BrowserRouterSchema = (incomingProps) => {
  const props = { ...schemaDefaultProps, ...incomingProps };
  return (
    <BrowserRouter>
      <RouterSchema {...props} />
    </BrowserRouter>
  );
};
BrowserRouterSchema.propTypes = schemaPropTypes;

/**
 * Renders the schema inside a {@link HashRouter}.
 *
 * @param {Object} incomingProps - Props containing the route schema.
 * @returns {JSX.Element} The hash router with the schema.
 *
 * @example
 * ```jsx
 * <HashRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export const HashRouterSchema = (incomingProps) => {
  const props = { ...schemaDefaultProps, ...incomingProps };
  return (
    <HashRouter>
      <RouterSchema {...props} />
    </HashRouter>
  );
};
HashRouterSchema.propTypes = schemaPropTypes;
