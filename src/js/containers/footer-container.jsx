import React from "react";
import { NavLink } from "react-router-dom";

export default class Footer extends React.Component {

  static jsClass = 'Footer';
  static defaultProps = {
    textOverColor: 'light',//light|dark
  }

  render() {
    let { menu, copyright, textOverColor } = this.props;
    let className = [
      'navbar',
      'navbar-' + textOverColor,
    ].filter(c => c).join(' ');
    return React.createElement('footer', {},
      menu
        ? React.createElement(React.Fragment, {},
          React.createElement('nav', { className },
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