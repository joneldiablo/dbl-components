import React from "react";
import { Link as ReactRouterLink, LinkProps as RRLinkProps } from "react-router-dom";

import Component, { ComponentProps } from "../component";

export interface LinkProps
  extends ComponentProps,
    Omit<RRLinkProps, keyof ComponentProps | "children"> {
  _component?: React.ElementType;
  children?: RRLinkProps["children"];
}

export default class Link extends Component<LinkProps> {
  static jsClass = "Link";
  static defaultProps = {
    ...Component.defaultProps,
  };

  tag = ReactRouterLink;

  get componentProps(): Record<string, unknown> {
    const {
      to,
      replace,
      state,
      preventScrollReset,
      relative,
      reloadDocument,
      target,
      _component,
    } = this.props;
    return {
      to,
      replace,
      state,
      preventScrollReset,
      relative,
      reloadDocument,
      target,
      component: _component,
    };
  }
}

