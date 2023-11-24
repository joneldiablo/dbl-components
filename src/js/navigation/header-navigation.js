import React from "react";
import { NavLink } from "react-router-dom";
import { Dropdown } from "bootstrap";
import Icons from "../media/icons";
import Svg from "../media/svg";
import ProportionalContainer from "../containers/proportional-container";
import components from "../functions/components-manager";

export default class HeaderNavigation extends Navigation {

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

  menuItem = item => {
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
    return React.createElement('li', { key: item.name, className: cn.join(' ') },
      item.menu ?
        React.createElement('a', { ref: this.dropdownInit, className: "nav-link dropdown-toggle", href: "#", id: item.name, role: "button", "data-toggle": "dropdown", "aria-expanded": "false" },
          content
        ) :
        React.createElement(NavLink, { to: item.path, exact: item.exact, className: "nav-link" },
          content
        ),
      item.menu?.length &&
      React.createElement('ul', { className: "dropdown-menu dropdown-menu-right", "aria-labelledby": item.name },
        item.menu.map(e => this.menuItem({ dropdown: true, ...e }))
      )
    );
  }

  render() {
    let { className, style, menu, label, icon, svg, img } = this.props;
    let cn = [HeaderNavigation, 'shadow-sm sticky-top', className].join(' ');
    return React.createElement('nav', { className: cn, style: style },
      React.createElement('div', { className: "py-2 position-relative" },
        React.createElement('div', { className: "position-absolute left-50 left-sm-0 top-50 translate-middle translatey-sm-middle mx-auto mx-sm-3" },
          icon && React.createElement(Icons, { icon: icon, inline: false }),
          svg && React.createElement(Svg, { ...svg }),
          img && React.createElement('img', { src: img }),
          label && React.createElement('span', null, label)
        ),
        React.createElement('div', { className: "ml-auto mr-3", style: { width: 'fit-content' } },
          menu?.length &&
          React.createElement('ul', { className: "navbar-nav" },
            menu.map(this.menuItem)
          )
        )
      )
    );
  }
}
