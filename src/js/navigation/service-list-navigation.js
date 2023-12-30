import React from "react";
import { NavLink } from "react-router-dom";
import urlJoin from "url-join";
import Icons from "../media/icons";

export default class ServiceListNavigation extends React.Component {

  static jsClass = 'ServiceListNavigation';
  static defaultProps = {
    url: '',
    iconSize: 40,
    iconDefault: 'image',
    iconFrom: 'icon',
    labelFrom: 'label',
    pathFrom: 'id',
    className: '',
    style: {}
  }

  state = {
    menu: [],
    stick: false,
    icon: 'chevron-right'
  }

  stick = (e) => {
    this.setState({
      stick: !this.state.stick,
      icon: this.state.stick ? 'chevron-right' : 'thumb-tack'
    });
  }

  constructor(props) {
    super(props);
    let { pathname } = this.props.location;
    var rex = pathname.substr(pathname.lastIndexOf('/')) + '$';
    this.path = pathname.replace(new RegExp(rex), '');
  }

  componentWillMount() {
    fetch(this.props.url)
      .then(r => r.json())
      .then(payload => {
        this.setState({ menu: payload });
      });
  }

  render() {
    let { iconDefault, iconSize, iconFrom, labelFrom, pathFrom, className, style } = this.props;
    let { menu, stick, icon } = this.state;
    let cn = [this.constructor.jsClass, className];
    if (stick) cn.push('stick');
    return React.createElement('div',
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
        Array.isArray(menu) && menu.map((item, i) =>
          React.createElement('li',
            { className: "nav-item", key: i },
            React.createElement(NavLink,
              {
                to: urlJoin(this.path, item[pathFrom] + ''),
                className: "nav-link",
                activeClassName: 'active'
              },
              item[iconFrom]
                ? React.createElement('img',
                  {
                    src: item[iconFrom], width: iconSize,
                    height: iconSize, style: { objectFit: 'cover' }
                  })
                : React.createElement(Icons,
                  {
                    icon: iconDefault, inline: false,
                    width: iconSize, height: iconSize
                  }),
              React.createElement('span', {
                className: "text-collapse text-nowrap"
              }, item[labelFrom])
            )
          )
        )
      )
    );
  }
}