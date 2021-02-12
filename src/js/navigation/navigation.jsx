import React from "react";
import { NavLink } from "react-router-dom";
import Component from "../component";

export default class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state.localClasses = 'nav';
  }

  link = (item, i) => {
    const cnLink = ['nav-link', this.props.linkClasses, item.classes];
    const propsLink = {
      to: item.path,
      className: cnLink.join(' '),
      activeClassName: 'active',
      strict: item.strict,
      exact: item.exact
    }
    return (<React.Fragment key={i + '-' + item.path}>
      <NavLink {...propsLink} >
        {item.label}
      </NavLink>
      {item.menu?.length && item.menu.map(this.link)}
    </React.Fragment>);
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    return (<>
      {this.props.menu.map(this.link)}
      {children}
    </>);
  }

  // TODO: buscar la forma de no repetir este frgamento de código
  //       permitir cambiar la etiqueta contenedora
  render() {
    let { classes, style } = this.props;
    let { localClasses, localStyles } = this.state;
    let cn = [this.constructor.name, this.name(), localClasses, classes].join(' ');
    const s = Object.assign({}, localStyles, style);
    return <nav className={cn} style={s} ref={this.ref}>
      {this.content()}
    </nav>
  }
}
