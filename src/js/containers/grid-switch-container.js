import React from "react";
import GridContainer from "./grid-container";

export default class GridSwitchContainer extends GridContainer {

  static jsClass = 'GridSwitchContainer';
  static defaultProps = {
    ...GridContainer.defaultProps
  }

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;
    let original = [...children];
    let arrChildren = [];
    while (original.length) {
      arrChildren.push(original.splice(0, 2));
    }
    return arrChildren.map((pair, i) =>
      React.createElement(React.Fragment,
        { key: i },
        this.grid(pair, (i % 2) && ['', 'order-sm-first'])
      )
    );
  }

}