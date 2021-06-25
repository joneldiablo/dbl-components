import React from "react";

import Component from "../component";
import { Link as ReactRouterLink } from "react-router-dom";

export default class Link extends Component {

  static jsClass = 'Link';
  static defaultProps = {
    ...Component.defaultProps
  }

  tag = ReactRouterLink;

  get componentProps() {
    const {
      to,
      replace,
      innerRef,
      _component
    } = this.props;

    return {
      to,
      replace,
      innerRef,
      component: _component
    }
  }

}