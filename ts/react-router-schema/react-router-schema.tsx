import React, { useEffect } from "react";
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
import withRouteWrapper, { RouteWrapperData } from "./with-route-wrapper";

/** Route definition supported by {@link SchemaController}. */
export interface RouteSchema extends RouteWrapperData {
  /** Route path or list of paths. */
  path?: string | string[];
  /** Arbitrary content passed to the controller. */
  content?: any;
  component?: string;
  exact?: boolean;
  strict?: boolean;
  location?: Record<string, unknown>;
  sensitive?: boolean;
  routes?: RouteSchema[] | Record<string, RouteSchema>;
  index?: boolean;
  action?: any;
  caseSensitive?: boolean;
  Component?: React.ComponentType<any>;
  ErrorBoundary?: React.ComponentType<any>;
  errorElement?: React.ReactNode;
  handle?: any;
  hasErrorBoundary?: boolean;
  HydrateFallback?: React.ComponentType<any>;
  hydrateFallbackElement?: React.ReactNode;
  id?: string;
  lazy?: any;
  loader?: any;
  shouldRevalidate?: any;
  test?: boolean;
}

/** Props for {@link SchemaController}. */
export interface SchemaProps {
  test?: boolean;
  theme?: string;
  routes?: RouteSchema | RouteSchema[];
  defaultController?: React.ComponentType<any>;
}

interface SchemaState {}

const schemaDefaultProps: Required<Pick<SchemaProps, "routes" | "defaultController">> = {
  routes: [],
  defaultController: (controllers as any).Controller,
};

/**
 * Controller that renders a React Router `Routes` tree from a schema.
 *
 * @example
 * ```tsx
 * <BrowserRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export default class SchemaController extends React.Component<SchemaProps, SchemaState> {
  static jsClass = "SchemaController";
  static defaultProps = schemaDefaultProps;

  routeNodes: React.ReactNode[] = [];
  routesHash: number;

  constructor(props: SchemaProps) {
    super(props);
    this.routesHash = hash(JSON.stringify(props.routes));
    this.buildRoutes();
  }

  componentDidUpdate() {
    const newHash = hash(JSON.stringify(this.props.routes));
    if (this.routesHash !== newHash) {
      this.buildRoutes();
      this.forceUpdate();
    }
  }

  /**
     * Builds the route elements from the provided schema.
     */
  private buildRoutes() {
    const schemaStr = JSON.stringify(this.props.routes);
    const routesSchema = JSON.parse(schemaStr);

    let routes: React.ReactNode[] = [];
    if (Array.isArray(routesSchema)) routes = routesSchema.map(this.views);
    else if (typeof routesSchema === "object" && routesSchema.name)
      routes = [this.views(routesSchema)];
    else if (typeof routesSchema === "object")
      routes = Object.keys(routesSchema).map((name, i) =>
        this.views({ name, ...routesSchema[name] }, i)
      );

    this.routeNodes = routes;
    this.routesHash = hash(JSON.stringify(this.props.routes));
  }

  /**
   * Recursively processes a route definition and returns a `Route` element.
   */
  private views = (route: RouteSchema, i?: number): React.ReactElement => {
    const Controller =
      (controllers as any)[route.component as keyof typeof controllers] ||
      this.props.defaultController ||
      (controllers as any).Controller;
    route.test = route.test || this.props.test;
    const WrappedController = withRouteWrapper(Controller, route);

    let subroutes: React.ReactElement[] = [];

    if (Array.isArray(route.routes)) subroutes = [];
    else if (typeof route.routes === "object") {
      subroutes = [];
      route.routes = Object.keys(route.routes).map((name) => ({
        name,
        ...(route.routes as Record<string, RouteSchema>)[name],
      }));
    }

    if (subroutes) {
      const mapRoutes = (subRoute: RouteSchema, i: number) => {
        subRoute = JSON.parse(JSON.stringify(subRoute));
        return this.views(subRoute, i);
      };
      subroutes = (route.routes as RouteSchema[]).map(mapRoutes);
    }

    const routeProps: any = {
      path: route.path as string | undefined,
      index: route.index ? true : undefined,
      action: route.action,
      caseSensitive: route.caseSensitive,
      Component: route.Component as any,
      ErrorBoundary: route.ErrorBoundary as any,
      errorElement: route.errorElement,
      handle: route.handle,
      hasErrorBoundary: route.hasErrorBoundary,
      HydrateFallback: route.HydrateFallback as any,
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

    const key =
      typeof i === "number" ? `${i}-${route.name}` : (route.name as string);

    return (
      <Route key={key} {...(routeProps as any)}>
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

/** Internal wrapper that dispatches location changes and renders the schema controller. */
const RouterSchema = (props: SchemaProps) => {
  const location = useLocation();
  useEffect(() => {
    eventHandler.dispatch("location", location);
  }, [location.pathname]);
  return <SchemaController {...props} />;
};

/**
 * Renders the schema inside a `BrowserRouter`.
 *
 * @example
 * ```tsx
 * <BrowserRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export const BrowserRouterSchema = (incomingProps: SchemaProps) => {
  const props = { ...schemaDefaultProps, ...incomingProps };
  return (
    <BrowserRouter>
      <RouterSchema {...props} />
    </BrowserRouter>
  );
};

/**
 * Renders the schema inside a `HashRouter`.
 *
 * @example
 * ```tsx
 * <HashRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export const HashRouterSchema = (incomingProps: SchemaProps) => {
  const props = { ...schemaDefaultProps, ...incomingProps };
  return (
    <HashRouter>
      <RouterSchema {...props} />
    </HashRouter>
  );
};
