import React, { createRef } from "react";

export default class Component extends React.Component {

  static defaultProps = {
    classes: '',
    style: {}
  }

  localClasses = '';
  localStyles = {};

  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  name() {
    const { name } = this.props;
    return name + '-' + this.constructor.name;
  }

  content(children = this.props.children) {
    return children;
  }

  render() {
    let { classes, style } = this.props;
    let cn = [this.constructor.name, this.name(), this.localClasses, classes].join(' ');
    const s = Object.assign({}, this.localStyles, style);
    return <div className={cn} style={s} ref={this.ref}>
      {this.content()}
    </div>
  }
}