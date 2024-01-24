import React from "react";
import PropTypes from "prop-types";
import { Link as ReactRouterLink } from "react-router-dom";

import Component from "../component";

export default class Link extends Component {

  static jsClass = 'Link';
  static propTypes = {
    ...ReactRouterLink.propTypes,
    ...Component.propTypes,
    ariaCurrent: PropTypes.string,
    _component: PropTypes.node
  }
  static defaultProps = {
    ...Component.defaultProps,
  }

  tag = ReactRouterLink;

  get componentProps() {
    const {
      to,
      replace,
      innerRef,
      target,
      _component
    } = this.props;

    return {
      to,
      replace,
      innerRef,
      target,
      component: _component
    }
  }

}