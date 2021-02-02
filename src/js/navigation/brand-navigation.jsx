import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "./navigation";

export default class BrandNavigation extends Navigation {

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
    return (<>
      <NavLink className="navbar-brand" to={path} exact={exact}>
        <div className="d-flex align-items-center">
          {logoSrc && <img {...propsLogo} />}
          <div className="brand-content" style={{ lineHeight: 1 }}>
            <p className="m-0">
              <b className="brandName">{brandName}</b>
            </p>
            <p className="m-0">
              <small className="slogan">{slogan}</small>
            </p>
          </div>
        </div>
      </NavLink>
      {children}
    </>);
  }

}