import React from "react";

export default class NavbarContainer extends React.Component {

  static defaultProps = {
    classes: 'navbar-light bg-light shadow-sm',
    style: {},
    fluid: true
  }

  render() {
    let { classes, style, name, children, fluid } = this.props;
    let cn = [this.constructor.name, name + '-container', classes, 'navbar'].join(' ');
    return <nav className={cn} style={style}>
      <div className={fluid ? 'container-fluid' : 'container'}>
        {children.map((item, i) =>
          <div key={i} className={['col', item.col?.classes].join(' ')}>{item}</div>)
        }
      </div>
    </nav>
  }
}