import React, { useLayoutEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { eventHandler } from "dbl-utils";

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
    console.log("REDIBUJAR", props.name, location.pathname);

    // 💥 Nos suscribimos a cambios de ruta para forzar re-render
    useLayoutEffect(() => {
      const callback = (nlocation) => {
        console.log(
          "cambió la ruta?????",
          props.name,
          nlocation.pathname,
          location.pathname
        );

        forceUpdate();
      };
      eventHandler.subscribe("location", callback, "wrapper-" + props.name);

      return () => {
        eventHandler.unsubscribe("location", callback, "wrapper-" + props.name);
      };
    }, []);

    // 🎨 Actualiza clases y estilos del body cada que cambia el pathname
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
