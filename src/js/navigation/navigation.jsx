import React from "react";
import { NavLink } from "react-router-dom";
import Component from "../component";

export default class Navigation extends Component {

  constructor(props) {
    super(props);
    this.state.localClasses = 'nav';
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    return (<>
      {this.props.menu.map((item, i) => {
        const cnLink = ['nav-link', item.classes];
        const propsLink = {
          to: item.path,
          className: cnLink.join(' '),
          activeClassName: 'active',
          strict: item.strict,
          exact: item.exact
        }
        return (<NavLink {...propsLink} key={i + '-' + item.path}>
          {item.label}
        </NavLink>);
      })}
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