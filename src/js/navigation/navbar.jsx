import React from "react";
import { NavLink } from "react-router-dom";
import { randomS4 } from "../functions";
import Icons from "../media/icons";

export default class Navbar extends React.Component {

  static jsClass = 'Navbar';
  static defaultProps = {
    logo: null,
    background: false,
    textOverColor: 'light',//light|dark
    logoHeight: 30,
    expand: 'md',
    menuPosition: 'right',
    shadow: false,//sm,lg
    centeredLogo: false, //center|between|around|evenly
  }

  id = this.constructor.jsClass + '-' + randomS4();

  render() {
    let { logo, logoHeight, site, menu,
      menuLeft, menuRight, background,
      textOverColor, expand, menuPosition,
      centeredLogo, shadow } = this.props;
    let className = [
      'navbar',
      'navbar-' + textOverColor,
      background && 'bg-' + background,
      'navbar-expand-' + expand,
      shadow && (typeof shadow === 'string' ? 'shadow-' + shadow : 'shadow')
    ].filter(c => c).join(' ');

    const menuItemFunc = (item, i) =>
      item && <NavLink key={i} to={item.path} className="nav-link" exact={item.exact} activeClassName='active'>
        <Icons icon={item.icon} className="mr-2" />
        {item.label}
      </NavLink>

    const Logo = ({ hidden, visible }) => {
      if (!logo && !site) return null;
      let className = ['navbar-brand',
        visible && `m-0 d-none d-${visible}-block`,
        hidden && `d-${hidden}-none`].filter(c => c).join(' ');
      return <NavLink className={className} to="/">
        <img src={logo} alt={site} height={logoHeight} />
        {site}
      </NavLink>
    }

    return <nav className={className}>
      <div className="container-fluid">
        <Logo hidden={centeredLogo && expand} />
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target={'#' + this.id}>
          <span className="navbar-toggler-icon"></span>
        </button>
        {centeredLogo ?
          <div className="collapse navbar-collapse" id={this.id}>
            <div className={'navbar-nav col justify-content-center'}>
              {menuLeft && menuLeft.map(menuItemFunc)}
            </div>
            <Logo visible={expand} />
            <div className={'navbar-nav col justify-content-center'}>
              {menuRight && menuRight.map(menuItemFunc)}
            </div>
          </div> :
          <div className="collapse navbar-collapse" id={this.id}>
            <div className={'navbar-nav ' + (menuPosition === 'right' ? 'ml-auto' : '')}>
              {menu && menu.map(menuItemFunc)}
            </div>
          </div>
        }
      </div>
    </nav>
  }
}