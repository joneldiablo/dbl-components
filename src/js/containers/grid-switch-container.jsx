import React from "react";
import GridContainer from "./grid-container";

export default class GridSwitchContainer extends GridContainer {

  static defaultProps = {
    ...GridContainer.defaultProps
  }

  content(children = this.props.children) {
    let arrChildren = [];
    while (children.length) {
      arrChildren.push(children.splice(0, 2));
    }
    return (<this.WrapRow>
      {arrChildren.map((pair, i) => <React.Fragment key={i}>
        {this.grid(pair, (i % 2) && ['', 'order-sm-first'])}
      </React.Fragment>)}
    </this.WrapRow>);
  }

}