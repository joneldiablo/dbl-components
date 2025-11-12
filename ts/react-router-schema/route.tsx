import React from "react";
import { Route as RouteRR } from "react-router-dom";

import Component, { ComponentProps } from "../component";

export interface RouteProps extends ComponentProps {
  active?: boolean;
  path?: string;
  index?: boolean;
  action?: unknown;
  caseSensitive?: boolean;
  Component?: React.ComponentType<any>;
  ErrorBoundary?: React.ComponentType<any>;
  errorElement?: React.ReactNode;
  handle?: unknown;
  hasErrorBoundary?: boolean;
  HydrateFallback?: React.ComponentType<any>;
  hydrateFallbackElement?: React.ReactNode;
  id?: string;
  lazy?: unknown;
  loader?: unknown;
  shouldRevalidate?: unknown;
  children?: React.ReactNode;
}

export default class Route extends Component<RouteProps> {
  static jsClass = "Route";
  static wrapper = false;

  render(): React.ReactElement | null {
    const { active, children, ...props } = this.props;
    const routeProps = { ...props, element: children };
    return active ? (
      <RouteRR {...(routeProps as any)} />
    ) : (
      <React.Fragment>{false}</React.Fragment>
    );
  }
}

