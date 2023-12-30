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
    ].filter(c => !!c).flat().join(' ');

    const menuItemFunc = (item, i) =>
      item && React.createElement(NavLink,
        {
          key: i, to: item.path, className: "nav-link",
          exact: item.exact, activeClassName: 'active'
        },
        React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
        item.label
      );

    const Logo = ({ hidden, visible }) => {
      if (!logo && !site) return null;
      let className = ['navbar-brand',
        visible && `m-0 d-none d-${visible}-block`,
        hidden && `d-${hidden}-none`].filter(c => c).flat().join(' ');
      return React.createElement(NavLink,
        { className, to: "/" },
        React.createElement('img', { src: logo, alt: site, height: logoHeight }),
        site
      )
    }

    return React.createElement('nav', { className: className },
      React.createElement('div', { className: "container-fluid" },
        React.createElement(Logo, { hidden: centeredLogo && expand },
          React.createElement('button',
            {
              className: "navbar-toggler",
              type: "button", 'data-toggle': "collapse",
              'data-target': '#' + this.id
            },
            React.createElement('span', { className: "navbar-toggler-icon" })
          ),
          centeredLogo
            ? React.createElement('div',
              { className: "collapse navbar-collapse", id: this.id },
              React.createElement('div',
                { className: 'navbar-nav col justify-content-center' },
                menuLeft && menuLeft.map(menuItemFunc),
              ),
              React.createElement(Logo, { visible: expand }),
              React.createElement('div', { className: 'navbar-nav col justify-content-center' },
                menuRight && menuRight.map(menuItemFunc)
              )
            )
            : React.createElement('div',
              { className: "collapse navbar-collapse", id: this.id },
              React.createElement('div',
                { className: 'navbar-nav ' + (menuPosition === 'right' ? 'ml-auto' : '') },
                menu && menu.map(menuItemFunc)
              )
            )
        )
      )
    )
  }
}