import PropTypes from 'prop-types';
import React from "react";
import { NavLink } from "react-router-dom";

export default class Footer extends React.Component {

  static propTypes = {
    classes: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    copyright: PropTypes.node,
    menu: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    textOverColor: PropTypes.string
  }

  static jsClass = 'Footer';
  static defaultProps = {
    textOverColor: 'light',//light|dark
  }

  render() {
    let { menu, copyright, textOverColor, classes } = this.props;
    let cn = ['navbar'];
    if (textOverColor) cn.push('navbar-' + textOverColor);
    if (classes) cn.push(classes);
    return React.createElement('footer', {},
      menu
        ? React.createElement(React.Fragment, {},
          React.createElement('nav', { className: cn.filter(c => !!c).flat().join(' ') },
            React.createElement('div', { className: "container-fluid" },
              React.createElement('div', { className: "navbar-nav" },
                menu.map((item, i) =>
                  item && React.createElement(NavLink,
                    { key: i, to: item.path, className: "nav-link", exact: item.exact, activeClassName: 'active' }, item.label
                  )
                )
              )
            )
          ),
          React.createElement('hr')
        )
        : React.createElement('br'),

      React.createElement('div', { className: "container-fluid text-muted" },
        copyright || React.createElement(React.Fragment, {},
          React.createElement('small', { className: "text-muted" }, copyright),
          React.createElement('small', { className: "float-right" }, 'Desarrollado por El Diablo')
        )
      ),
      React.createElement('br')
    )
  }
}