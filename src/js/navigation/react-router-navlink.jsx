import React from "react";

import Component from "../component";
import { NavLink as ReactRouterNavLink } from "react-router-dom";

export default class NavLink extends Component {

  static jsClass = 'NavLink';
  static defaultProps = {
    ...Component.defaultProps
  }

  tag = ReactRouterNavLink;

  get componentProps() {
    const {
      activeClassName,
      activeStyle,
      exact,
      strict,
      isActive,
      location,
      ariaCurrent,
      to,
      replace,
      innerRef,
      _component
    } = this.props;

    return {
      activeClassName,
      activeStyle,
      exact,
      strict,
      isActive,
      location,
      'aria-current': ariaCurrent,
      to,
      replace,
      innerRef,
      component: _component
    }
  }

}