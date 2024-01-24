import React from "react";
import PropTypes from "prop-types";
import { NavLink as ReactRouterNavLink } from "react-router-dom";

import Component from "../component";



export default class NavLink extends Component {

  static jsClass = 'NavLink';
  static propTypes = {
    ...ReactRouterNavLink.propTypes,
    ...Component.propTypes,
    ariaCurrent: ReactRouterNavLink.propTypes['aria-current'],
    _component: PropTypes.node
  }
  static defaultProps = {
    ...Component.defaultProps,
  }

  tag = ReactRouterNavLink;

  get componentProps() {
    const {
      activeClassName,
      activeStyle,
      exact,
      strict,
      isActive,
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
      'aria-current': ariaCurrent,
      to,
      replace,
      innerRef,
      component: _component
    }
  }

}