import React from "react";

export default class Container extends React.Component {

  static defaultProps = {
    classes: '',
    style: {},
    fluid: true
  }

  render() {
    let { classes, style, name, children, fluid } = this.props;
    let cn = [this.constructor.name, name + '-container', classes].join(' ');
    return <div className={cn} style={style}>
      <div className={fluid ? 'container-fluid' : 'container'}>
        {children}
      </div>
    </div>
  }
}