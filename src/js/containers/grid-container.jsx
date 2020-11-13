import React from "react";

export default class Container extends React.Component {

  render() {
    return <div className="row h-100 gx-0 overflow-auto">
      {this.props.children.map(child =>
        <div className="col" style={{ width: 0 }}>
          {child}
        </div>
      )}
    </div>
  }
}