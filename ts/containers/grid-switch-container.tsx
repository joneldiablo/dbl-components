import React from "react";

import GridContainer from "./grid-container";

export default class GridSwitchContainer extends GridContainer {
  static override jsClass = "GridSwitchContainer";
  static override defaultProps = {
    ...GridContainer.defaultProps,
  };

  private withKey(node: React.ReactNode, key: number): React.ReactNode {
    return React.isValidElement(node)
      ? React.cloneElement(node, { key })
      : node;
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;

    const childrenArray = React.Children.toArray(children);
    const queue = [...childrenArray];
    const left: React.ReactNode[] = [];
    const right: React.ReactNode[] = [];

    while (queue.length) {
      left.push(queue.shift() ?? null, null);
      right.push(null, queue.shift() ?? null);
    }

    const leftGrid = (this.grid(left) as React.ReactNode[]).filter(Boolean);
    const rightGrid = (this.grid(right) as React.ReactNode[]).filter(Boolean);

    const result: React.ReactNode[] = [];
    let toggler = false;
    let keyIndex = 0;

    while (leftGrid.length) {
      const lc = leftGrid.shift();
      const rc = rightGrid.shift();
      const keyedLc = lc ? this.withKey(lc, keyIndex++) : null;
      const keyedRc = rc ? this.withKey(rc, keyIndex++) : null;

      if (toggler) {
        if (keyedRc) result.push(keyedRc);
        if (keyedLc) result.push(keyedLc);
      } else {
        if (keyedLc) result.push(keyedLc);
        if (keyedRc) result.push(keyedRc);
      }

      toggler = !toggler;
    }

    return result;
  }
}
