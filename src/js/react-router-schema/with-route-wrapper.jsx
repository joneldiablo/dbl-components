import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/**
 * Wrapper component to manage class names and styles in the body element
 * based on the current route and its props.
 * @param {Object} WrappedComponent - The component to wrap (Controller).
 * @param {Object} route - The current route object containing name, style, and other properties.
 * @returns {JSX.Element} - The wrapped component with added functionality.
 */
const withRouteWrapper = (WrappedComponent, route) => {
  return function RouteWrapper(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    useEffect(() => {
      // Manage body class based on route name
      const viewClassName = Array.from(document.body.classList).find((cl) =>
        cl.endsWith("-view")
      );
      if (viewClassName) {
        document.body.classList.remove(viewClassName);
      }
      document.body.classList.add(`${route.name}-view`);

      // Remove old location-based classes and add new location class
      document.body.classList.forEach((cls) => {
        if (cls.startsWith("location-")) {
          document.body.classList.remove(cls);
        }
      });
      document.body.classList.add(
        `location${location.pathname.replace(/\//g, "-")}`
      );

      // Forzar actualización del componente si cambia la ruta
      forceUpdate();

      // Apply custom styles to route if provided
      if (!route.style) {
        route.style = {};
      }
      route.style["--component-name"] = `"${route.name}"`;

      // Cleanup function to remove added classes when the component unmounts or route changes
      return () => {
        document.body.classList.remove(`${route.name}-view`);
        document.body.classList.remove(
          `location${location.pathname.replace(/\//g, "-")}`
        );
      };
    }, [location.pathname]);

    return (
      <WrappedComponent
        {...props}
        location={location}
        navigate={navigate}
        match={params}
        route={route}
      />
    );
  };
};

export default withRouteWrapper;
