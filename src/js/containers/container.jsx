import React from "react";
import Component from "../component";

export default class Container extends Component {

  static defaultProps = {
    ...Component.defaultProps,
    fluid: true,
    fullWidth: false,
    gutter: ''
  }

  content(children = this.props.children) {
    const { fluid, fullWidth, gutter } = this.props;
    const containerType = (!fullWidth ? (fluid ? 'container-fluid' : 'container') : 'container-fullwidth');
    const cn = [containerType, gutter];
    return <div className={cn.join(' ')}>
      {children}
    </div>
  }
}