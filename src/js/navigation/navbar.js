import PropTypes from 'prop-types';
import React from "react";
import { NavLink } from "react-router-dom";

import { randomS4, extractNodeString } from "dbl-utils";

import Icons from "../media/icons";

export default class Navbar extends React.Component {

  static propTypes = {
    activeClassName: PropTypes.string,
    background: PropTypes.string,
    centeredLogo: PropTypes.bool,
    classes: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    expand: PropTypes.string,
    logo: PropTypes.string,
    logoHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    menu: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    menuLeft: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    menuPosition: PropTypes.oneOf(['right', 'left']),
    menuRight: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    shadow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    site: PropTypes.node,
    textOverColor: PropTypes.string
  }

  static jsClass = 'Navbar';
  static defaultProps = {
    activeClassName: 'active',
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
      menuLeft, menuRight, background, activeClassName,
      textOverColor, expand, menuPosition,
      centeredLogo, shadow, classes, className } = this.props;

    let cn = [this.constructor.jsClass, 'navbar'];
    if (textOverColor) cn.push('navbar-' + textOverColor);
    if (background) cn.push('bg-' + background);
    if (expand) cn.push('navbar-expand-' + expand);
    if (shadow) cn.push(typeof shadow === 'string' ? 'shadow-' + shadow : 'shadow');
    if (classes) cn.push(classes);
    if (className) cn.push(className);

    const menuItemFunc = ([i, item]) =>
      item && React.createElement(NavLink,
        {
          key: i, to: item.path, className: "nav-link",
          exact: item.exact, activeClassName
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
        logo && React.createElement('img', { src: logo, alt: extractNodeString(site), height: logoHeight }),
        site
      )
    }

    return React.createElement('nav', { className: cn.filter(c => !!c).flat().join(' ') },
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
                menuLeft && Object.entries(menuLeft).map(menuItemFunc),
              ),
              React.createElement(Logo, { visible: expand }),
              React.createElement('div', { className: 'navbar-nav col justify-content-center' },
                menuRight && Object.entries(menuRight).map(menuItemFunc)
              )
            )
            : React.createElement('div',
              { className: "collapse navbar-collapse", id: this.id },
              React.createElement('div',
                { className: 'navbar-nav ' + (menuPosition === 'right' ? 'ml-auto' : '') },
                menu && Object.entries(menu).map(menuItemFunc)
              )
            )
        )
      )
    )
  }
}