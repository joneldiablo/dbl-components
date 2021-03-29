import React from "react";

export default class Hero extends React.Component {

  static jsClass = 'Hero';

  render() {
    return <div style={{ height: '100vh' }}>
      {this.props.children}
    </div>
  }
}