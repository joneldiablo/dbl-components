import React from "react";
import Container from "./container";

export default class NavbarContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    classes: 'navbar-light bg-light shadow-sm',
    fluid: true
  }

  localClasses = 'navbar';

  content() {
    const { children } = this.props;
    const c = children.map((item, i) =>
      <div key={i} className={['col', item.col?.classes].join(' ')}>{item}</div>);
    return super.content(c);
  }

}