export default withRouteWrapper;
/**
 * Wrapper component to manage class names and styles in the body element
 * based on the current route and its props.
 * @param {Object} WrappedComponent - The component to wrap (Controller).
 * @param {Object} route - The current route object containing name, style, and other properties.
 * @returns {JSX.Element} - The wrapped component with added functionality.
 */
declare function withRouteWrapper(WrappedComponent: Object, route: Object): JSX.Element;
