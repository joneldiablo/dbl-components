import React from "react";
import { NavLink } from "react-router-dom";
import { randomS4 } from "dbl-utils";
import { extractNodeString } from "dbl-utils/extract-react-node-text";

import Icons from "../media/icons";

export interface NavbarMenuItem {
  path: string;
  exact?: boolean;
  label: React.ReactNode;
  icon?: string;
}

export interface NavbarProps {
  activeClassName?: string;
  background?: string;
  centeredLogo?: boolean;
  classes?: string | string[];
  className?: string | string[];
  expand?: string;
  logo?: string | null;
  logoHeight?: number | string;
  menu?: Record<string, NavbarMenuItem>;
  menuLeft?: Record<string, NavbarMenuItem>;
  menuPosition?: "right" | "left";
  menuRight?: Record<string, NavbarMenuItem>;
  shadow?: boolean | string;
  site?: React.ReactNode;
  textOverColor?: string;
}

interface NavbarState { }

export default class Navbar extends React.Component<NavbarProps, NavbarState> {
  static jsClass = "Navbar";

  static defaultProps: NavbarProps = {
    activeClassName: "active",
    logo: null,
    background: undefined,
    textOverColor: "light",
    logoHeight: 30,
    expand: "md",
    menuPosition: "right",
    shadow: false,
    centeredLogo: false,
  };

  id: string = `${Navbar.jsClass}-${randomS4()}`;

  render(): React.ReactNode {
    const {
      logo,
      logoHeight,
      site,
      menu,
      menuLeft,
      menuRight,
      background,
      activeClassName,
      textOverColor,
      expand,
      menuPosition,
      centeredLogo,
      shadow,
      classes,
      className,
    } = this.props;

    const cn = [Navbar.jsClass, "navbar"] as (string | string[])[];
    if (textOverColor) cn.push(`navbar-${textOverColor}`);
    if (background) cn.push(`bg-${background}`);
    if (expand) cn.push(`navbar-expand-${expand}`);
    if (shadow) cn.push(typeof shadow === "string" ? `shadow-${shadow}` : "shadow");
    if (classes) cn.push(classes);
    if (className) cn.push(className);

    const menuItemFunc = ([i, item]: [string, NavbarMenuItem]) =>
      item && (
        <NavLink
          key={i}
          to={item.path}
          className={({ isActive }) =>
            "nav-link" + (isActive ? ` ${activeClassName}` : "")
          }
          end={item.exact}
        >
          <Icons icon={item.icon} className="mr-2" />
          {item.label}
        </NavLink>
      );

    const Logo: React.FC<{ hidden?: string; visible?: string }> = ({ hidden, visible }) => {
      if (!logo && !site) return null;
      const cls = [
        "navbar-brand",
        visible && `m-0 d-none d-${visible}-block`,
        hidden && `d-${hidden}-none`,
      ]
        .filter(Boolean)
        .flat()
        .join(" ");
      return (
        <NavLink className={cls} to="/">
          {logo && <img src={logo} alt={extractNodeString(site)} height={logoHeight} />}
          {site}
        </NavLink>
      );
    };

    return (
      <nav className={cn.filter(Boolean).flat().join(" ")}>
        <div className="container-fluid">
          <Logo hidden={centeredLogo && expand ? expand : undefined} />
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target={`#${this.id}`}>
            <span className="navbar-toggler-icon" />
          </button>
          {centeredLogo ? (
            <div className="collapse navbar-collapse" id={this.id}>
              <div className="navbar-nav col justify-content-center">
                {menuLeft && Object.entries(menuLeft).map(menuItemFunc)}
              </div>
              <Logo visible={expand} />
              <div className="navbar-nav col justify-content-center">
                {menuRight && Object.entries(menuRight).map(menuItemFunc)}
              </div>
            </div>
          ) : (
            <div className="collapse navbar-collapse" id={this.id}>
              <div className={`navbar-nav ${menuPosition === "right" ? "ml-auto" : ""}`}>
                {menu && Object.entries(menu).map(menuItemFunc)}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

