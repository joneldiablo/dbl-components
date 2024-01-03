import PropTypes from 'prop-types';
import React from "react";
import { NavLink } from "react-router-dom";
import Icons from "../media/icons";

export default class SideNavigation extends React.Component {

  static propTypes = {
    className: PropTypes.any,
    iconSize: PropTypes.any,
    menu: PropTypes.any,
    style: PropTypes.any
  }

  static jsClass = 'SideNavigation';
  static defaultProps = {
    className: '',
    style: {},
    menu: [],
    iconSize: 40
  }

  state = {
    stick: false,
    icon: 'chevron-right'
  }

  stick = (e) => {
    this.setState({
      stick: !this.state.stick,
      icon: this.state.stick ? 'chevron-right' : 'thumb-tack'
    }, () => window.focus());
  }

  render() {
    let { menu, iconSize, className, style } = this.props;
    let { stick, icon } = this.state;
    let cn = [this.constructor.jsClass, className];
    if (stick) cn.push('stick');
    return (React.createElement('div',
      { className: cn.flat().join(' '), style },
      React.createElement('ul',
        { className: "nav flex-column" },
        React.createElement('li', { className: "nav-item" },
          React.createElement('div', { className: "nav-link clearfix px-0" },
            React.createElement('div',
              {
                style: { width: iconSize, height: iconSize },
                className: "d-flex justify-content-end align-items-center float-right"
              },
              React.createElement('span',
                {
                  className: "wrap-collapse-arrow",
                  style: { cursor: 'pointer' },
                  onClick: this.stick
                },
                React.createElement(Icons, { icon, className: "collapse-arrow" })
              )
            )
          )
        ),
        menu.map((item, i) =>
          React.createElement('li',
            { className: "nav-item", key: i },
            React.createElement(NavLink,
              {
                to: item.path, className: "nav-link",
                exact: item.exact, activeClassName: 'active'
              },
              React.createElement(Icons,
                { icon: item.icon, inline: false, width: iconSize, height: iconSize }),
              React.createElement('span', { className: "text-collapse" }, item.label)
            )
          )
        )
      )
    ));
  }
}