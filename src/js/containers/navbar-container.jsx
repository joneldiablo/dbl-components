import React from "react";
import Container from "./container";

export default class NavbarContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    classes: 'navbar-light bg-light shadow-sm',
    fluid: true
  }

  content() {
    const { children } = this.props;
    const c = children.map((item, i) =>
      <div key={i} className={['col', item.col?.classes].join(' ')}>{item}</div>);
    return super.content(c);
  }

  render() {
    let { classes, style } = this.props;
    let cn = [this.constructor.name, this.name(), this.localClasses, classes, 'navbar'].join(' ');
    const s = Object.assign({}, this.localStyles, style);
    return <nav className={cn} style={s}>
      {this.content()}
    </nav>
  }
}