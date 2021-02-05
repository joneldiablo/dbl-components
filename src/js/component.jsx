import React, { createRef } from "react";

export default class Component extends React.Component {

  static defaultProps = {
    classes: '',
    style: {}
  }

  state = {
    localClasses: '',
    localStyles: {}
  }

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
    let { localClasses, localStyles } = this.state;
    let cn = [this.constructor.name, this.name(), localClasses, classes].join(' ');
    const s = Object.assign({}, localStyles, style);
    return <div className={cn} style={s} ref={this.ref}>
      {this.content()}
    </div>
  }
}