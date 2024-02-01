import React from "react";
import GridContainer from "./grid-container";

export default class GridSwitchContainer extends GridContainer {

  static jsClass = 'GridSwitchContainer';
  static defaultProps = {
    ...GridContainer.defaultProps
  }

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;
    const original = [...children];
    let leftChildren = [];
    let rightChildren = [];

    while (original.length) {
      leftChildren.push(original.shift(), null);
      rightChildren.push(null, original.shift());
    }

    leftChildren = this.grid(leftChildren).filter(c => !!c);
    rightChildren = this.grid(rightChildren).filter(c => !!c);

    let toggler = false;
    let count = 0;
    while (leftChildren.length) {
      const lc = leftChildren.shift();
      const rc = rightChildren.shift();
      lc.key = count++;
      rc.key = count++;
      if (toggler)
        original.push(rc);

      original.push(lc);

      if (!toggler)
        original.push(rc);

      toggler = !toggler;
    }

    return original.filter(c => !!c);
  }

}