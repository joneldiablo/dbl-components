import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown } from "bootstrap";
import Icons from "../media/icons";
import Svg from "../media/svg";
import AspectRatioContainer from "../containers/aspect-ratio-container";
import components from "../functions/components-manager";

export default class HeaderNavigation extends React.Component {

  dropdowns = [];

  componentWillUnmount() {
    this.dropdowns.forEach(d => d.dispose());
  }

  dropdownInit = (ref) => {
    if (ref) this.dropdowns.push(new Dropdown(ref));
  }

  menuItem = item => {
    if (item === 'divider') {
      return (<li key={item.name}><hr class="dropdown-divider" /></li>);
    }
    if (item.component) {
      let Component = components[item.component];
      return Component && <li><Component {...item.attributes} /></li>;
    }
    let cn = [item.dropdown ? 'dropdown-item' : 'nav-item'];
    if (item.menu?.length) cn.push('dropdown');

    let content = <>
      {item.icon && <Icons icon={item.icon} className="mr-1" />}
      {(item.svg || item.image) &&
        <AspectRatioContainer className="rounded-circle mr-1">
          {item.svg && <Svg {...item.svg} className="w-100 h-100" />}
          {item.image && <img {...item.image} className="w-100 h-100 img-cover" />}
        </AspectRatioContainer>}
      <span className={item.icon && !item.dropdown ? 'd-none d-sm-inline' : ''}>{item.label}</span>
    </>;
    return <li key={item.name} className={cn.join(' ')}>
      {item.menu ?
        <a ref={this.dropdownInit} className="nav-link dropdown-toggle" href="#" id={item.name} role="button" data-toggle="dropdown" aria-expanded="false">
          {content}
        </a> :
        <NavLink to={item.path} exact={item.exact} className="nav-link">
          {content}
        </NavLink>}
      {item.menu?.length &&
        <ul className="dropdown-menu" aria-labelledby={item.name}>
          {item.menu.map(e => this.menuItem({ dropdown: true, ...e }))}
        </ul>}
    </li>
  }

  render() {
    let { className, style, menu, label, icon, svg, img } = this.props;
    let cn = [HeaderNavigation, 'shadow-sm sticky-top', className].join(' ');
    return <nav className={cn} style={style}>
      <div className="py-2 position-relative">
        <div className="position-absolute left-50 left-sm-0 top-50 translate-middle translatey-sm-middle mx-3" >
          {icon && <Icons icon={icon} inline={false} />}
          {svg && <Svg {...svg} />}
          {img && <img src={img} />}
          {label && <span >{label}</span>}
        </div>
        <div className="ml-auto mr-3" style={{ width: 'fit-content' }}>
          {menu?.length &&
            <ul className="navbar-nav">
              {menu.map(this.menuItem)}
            </ul>}
        </div>
      </div>
    </nav>
  }
}