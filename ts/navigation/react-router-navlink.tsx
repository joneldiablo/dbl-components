import React from "react";
import { NavLink as ReactRouterNavLink, NavLinkProps as RRNavLinkProps } from "react-router-dom";

import Component, { ComponentProps } from "../component";

export interface NavLinkProps
  extends ComponentProps,
    Omit<RRNavLinkProps, keyof ComponentProps | "children"> {
  _component?: React.ElementType;
  ariaCurrent?: string;
  children?: React.ReactNode;
}

export default class NavLink extends Component<NavLinkProps> {
  static jsClass = "NavLink";
  static defaultProps = {
    ...Component.defaultProps,
  };

  tag = ReactRouterNavLink;

  get componentProps(): Record<string, unknown> {
    const {
      to,
      end,
      caseSensitive,
      replace,
      state,
      preventScrollReset,
      relative,
      reloadDocument,
      ariaCurrent,
      _component,
    } = this.props;
    return {
      to,
      end,
      caseSensitive,
      replace,
      state,
      preventScrollReset,
      relative,
      reloadDocument,
      component: _component,
      "aria-current": ariaCurrent,
    };
  }
}

