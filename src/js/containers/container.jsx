import React from "react";
import { randomS4 } from "../functions";

export default class Container extends React.Component {

  static defaultProps = {
    className: '',
    style: {}
  }

  id = this.constructor.name + '-' + randomS4();

  render() {
    let { className, style } = this.props;
    let cn = [this.constructor.name, className].join(' ');
    return <div id={this.id} className={cn} style={style}>
      {this.props.children}
    </div>
  }
}