import PropTypes from 'prop-types';
import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown } from "bootstrap";
import Icons from "../media/icons";
import Svg from "../media/svg";
import ProportionalContainer from "../containers/proportional-container";
import components from "../functions/components-manager";

export default class HeaderNavigation extends Navigation {

  static propTypes = {
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    classes: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    icon: PropTypes.string,
    img: PropTypes.string,
    label: PropTypes.node,
    menu: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    style: PropTypes.object,
    svg: PropTypes.object
  }

  static jsClass = 'HeaderNavigation';

  constructor(props) {
    super(props);
    this.dropdowns = [];
  }

  componentWillUnmount() {
    this.dropdowns.forEach(d => d.dispose());
  }

  dropdownInit = (ref) => {
    if (ref) this.dropdowns.push(new Dropdown(ref));
  }

  menuItem = ([i, item]) => {
    if (item === 'divider') {
      return (React.createElement('li', { key: item.name },
        React.createElement('hr', { className: "dropdown-divider" })
      ));
    }
    if (item.component) {
      let Component = components[item.component];
      return Component && React.createElement('li', null,
        React.createElement(Component, { ...item.attributes })
      );
    }
    let cn = [item.dropdown ? 'dropdown-item' : 'nav-item'];
    if (item.menu?.length) cn.push('dropdown');

    let content = React.createElement(React.Fragment, {},
      item.icon && React.createElement(Icons, { icon: item.icon, className: "mr-1" }),
      (item.svg || item.image) &&
      React.createElement(ProportionalContainer, { className: "rounded-circle mr-1" },
        item.svg && React.createElement(Svg, { ...item.svg, className: "w-100 h-100" }),
        item.image && React.createElement('img', { ...item.image, className: "w-100 h-100 img-cover" })
      ),
      React.createElement('span', { className: item.icon && !item.dropdown ? 'd-none d-sm-inline' : '' }, item.label)
    );
    return React.createElement('li', { key: item.name, className: cn.flat().join(' ') },
      item.menu ?
        React.createElement('a', { ref: this.dropdownInit, className: "nav-link dropdown-toggle", href: "#", id: item.name, role: "button", "data-toggle": "dropdown", "aria-expanded": "false" },
          content
        ) :
        React.createElement(NavLink, { to: item.path, exact: item.exact, className: "nav-link" },
          content
        ),
      item.menu?.length &&
      React.createElement('ul', { className: "dropdown-menu dropdown-menu-right", "aria-labelledby": item.name },
        Object.entries(item.menu).map(([i, e]) => this.menuItem([i, { dropdown: true, ...e }]))
      )
    );
  }

  render() {
    let { className, classes, style, menu, label, icon, svg, img } = this.props;
    let cn = [this.constructor.jsClass, 'shadow-sm sticky-top'];
    if (className) cn.push(className);
    if (classes) cn.push(classes);

    return React.createElement('nav', { className: cn.filter(c => !!c).flat().join(' '), style },
      React.createElement('div', { className: "py-2 position-relative" },
        React.createElement('div', { className: "position-absolute left-50 left-sm-0 top-50 translate-middle translatey-sm-middle mx-auto mx-sm-3" },
          icon && React.createElement(Icons, { icon, inline: false }),
          svg && React.createElement(Svg, { ...svg }),
          img && React.createElement('img', { src: img }),
          label && React.createElement('span', null, label)
        ),
        React.createElement('div', { className: "ml-auto mr-3", style: { width: 'fit-content' } },
          menu?.length &&
          React.createElement('ul', { className: "navbar-nav" },
            Object.entries(menu).map(this.menuItem)
          )
        )
      )
    );
  }
}
