import React from "react";
import { NavLink } from "react-router-dom";
import Component from "../component";

export default class Navigation extends Component {

  localClasses = 'nav';

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content() {
    return this.props.menu.map(item => {
      const cnLink = ['nav-link', item.classes];
      const propsLink = {
        to: item.path,
        className: cnLink.join(' '),
        activeClassName: 'active',
        strict: item.strict,
        exact: item.exact
      }
      return (<NavLink {...propsLink}>
        {item.label}
      </NavLink>);
    });
  }

  // TODO: buscar la forma de no repetir este frgamento de código
  //       permitir cambiar la etiqueta contenedora
  render() {
    let { classes, style } = this.props;
    let cn = [this.constructor.name, this.name(), this.localClasses, classes].join(' ');
    const s = Object.assign({}, this.localStyles, style);
    return <nav className={cn} style={s}>
      {this.content()}
    </nav>
  }
}