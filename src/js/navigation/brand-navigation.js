import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "./navigation";

export default class BrandNavigation extends Navigation {

  static jsClass = 'BrandNavigation';
  static defaultProps = {
    ...Navigation.defaultProps,
    path: '/',
    logoWidth: 40,
    logoHeight: 'auto',
    exact: true
  }

  content(children = this.props.children) {
    const { logoSrc, path, brandName, logoWidth,
      logoHeight, logoClasses, logoStyle, slogan, exact } = this.props;
    const propsLogo = {
      src: logoSrc,
      alt: brandName,
      width: logoWidth,
      height: logoHeight,
      className: ['mr-2', logoClasses].join(' '),
      style: logoStyle
    }
    return React.createElement(React.Fragment, {},
      React.createElement(NavLink, { className: "navbar-brand", to: path, exact: exact },
        React.createElement('div', { className: "d-flex align-items-center" },
          logoSrc && React.createElement('img', { ...propsLogo }),
          React.createElement('div', { className: "brand-content", style: { lineHeight: 1 } },
            React.createElement('p', { className: "m-0" },
              React.createElement('b', { className: "brandName" }, brandName)
            ),
            React.createElement('p', { className: "m-0" },
              React.createElement('small', { className: "slogan" }, slogan)
            )
          )
        )
      ),
      children
    );
  }
}
