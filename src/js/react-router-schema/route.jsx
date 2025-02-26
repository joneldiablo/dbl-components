import { Route as RouteRR } from "react-router-dom";
import PropTypes from "prop-types";

import Component from "../component";

export default class Route extends Component {
  static jsClass = 'Route';
  static wrapper = false;
  static propTypes = {
    ...RouteRR.propTypes,
    name: PropTypes.string,
    active: PropTypes.bool
  }

  render() {
    const {
      active,
      name,
      path,
      index,
      action,
      caseSensitive,
      Component,
      ErrorBoundary,
      errorElement,
      handle,
      hasErrorBoundary,
      HydrateFallback,
      hydrateFallbackElement,
      id,
      lazy,
      loader,
      shouldRevalidate,
      children
    } = this.props;

    const props = {
      key: name,
      path,
      index,
      action,
      caseSensitive,
      Component,
      ErrorBoundary,
      errorElement,
      handle,
      hasErrorBoundary,
      HydrateFallback,
      hydrateFallbackElement,
      id,
      lazy,
      loader,
      shouldRevalidate,
      element: children
    };

    return active
      ? <RouteRR {...props} />
      : <React.Fragment>{false}</React.Fragment>;
  }
}