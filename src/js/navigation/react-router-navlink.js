import React from "react";
import PropTypes from "prop-types";
import { NavLink as ReactRouterNavLink } from "react-router-dom";

import Component from "../component";



export default class NavLink extends Component {

  static jsClass = 'NavLink';
  static propTypes = {
    ...ReactRouterNavLink.propTypes,
    ...Component.propTypes,
    ariaCurrent: PropTypes.string,
    _component: PropTypes.node
  }
  static defaultProps = {
    ...Component.defaultProps,
  }

  tag = ReactRouterNavLink;

  get componentProps() {
    const {
      strict,
      ariaCurrent,
      to,
      replace,
      ref,
      end,
      _component
    } = this.props;

    return {
      strict,
      'aria-current': ariaCurrent,
      to,
      replace,
      ref,
      end,
      component: _component
    }
  }

}