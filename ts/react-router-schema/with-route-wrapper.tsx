import React, { useLayoutEffect, useRef, useReducer } from "react";
import { useLocation, useNavigate, useParams, NavigateFunction } from "react-router-dom";
import { eventHandler } from "dbl-utils";

/**
 * Route metadata passed to the wrapped component.
 */
export interface RouteWrapperData {
  /** Route name used for body class management. */
  name?: string;
  /** Optional inline styles applied to the route. */
  style?: Record<string, string>;
}

/**
 * Higher-order component that augments a controller with routing helpers and
 * body class management.
 *
 * @param WrappedComponent - Controller to wrap.
 * @param route - Route definition information.
 * @returns Wrapped React component.
 *
 * @example
 * ```tsx
 * const Wrapped = withRouteWrapper(MyController, { name: 'home' });
 * ```
 */
const withRouteWrapper = <P extends { name?: string }>(
  WrappedComponent: React.ComponentType<
    P & {
      location: ReturnType<typeof useLocation>;
      navigate: NavigateFunction;
      match: Record<string, string | undefined>;
      route: RouteWrapperData;
    }
  >,
  route: RouteWrapperData
) => {
  return function RouteWrapper(props: P) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

    // Subscribe to route changes to force a re-render when navigation occurs.
    useLayoutEffect(() => {
      const callback = (nlocation: ReturnType<typeof useLocation>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          if (nlocation.pathname !== location.pathname) forceUpdate();
        }, 50);
      };
      (eventHandler as any).subscribe("location", callback, "wrapper-" + props.name);

      return () => {
        (eventHandler as any).unsubscribe("location", callback, "wrapper-" + props.name);
      };
    }, []);

    // Update body classes and styles whenever the pathname changes.
    useLayoutEffect(() => {
      const viewClassName = Array.from(document.body.classList).find((cl) =>
        cl.endsWith("-view")
      );
      if (viewClassName) {
        document.body.classList.remove(viewClassName);
      }
      document.body.classList.add(`${route.name}-view`);

      document.body.classList.forEach((cls) => {
        if (cls.startsWith("location-")) {
          document.body.classList.remove(cls);
        }
      });

      document.body.classList.add(
        `location${location.pathname.replace(/\//g, "-")}`
      );

      if (!route.style) route.style = {};
      route.style["--component-name"] = `"${route.name}"`;

      return () => {
        document.body.classList.remove(`${route.name}-view`);
        document.body.classList.remove(
          `location${location.pathname.replace(/\//g, "-")}`
        );
      };
    }, [location.pathname]);

    return (
      <WrappedComponent
        {...(props as P)}
        location={location}
        navigate={navigate}
        match={params}
        route={route}
      />
    );
  };
};

export default withRouteWrapper;
