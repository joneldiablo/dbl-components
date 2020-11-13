import React from "react";
import { NavLink } from "react-router-dom";

export default class Footer extends React.Component {
  static defaultProps = {
    textOverColor: 'light',//light|dark
  }
  render() {
    let { menu, copyright, textOverColor } = this.props;
    let className = [
      'navbar',
      'navbar-' + textOverColor,
    ].filter(c => c).join(' ');
    return <footer>
      {menu ? <>
        <nav className={className}>
          <div className="container-fluid">
            <div className="navbar-nav">
              {menu.map((item, i) =>
                item && <NavLink key={i} to={item.path} className="nav-link" exact={item.exact} activeClassName='active'>{item.label}</NavLink>
              )}
            </div>
          </div>
        </nav>
        <hr />
      </> : <br />}
      <div className="container-fluid text-muted">
        {copyright || <>
          <small className="text-muted">
            copyright
          </small>
          <small className="float-right">Desarrollado por El Diablo</small>
        </>}
      </div>
      <br />
    </footer>
  }
}