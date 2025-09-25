import React from "react";
import { NavLink } from "react-router-dom";

import Icons from "../media/icons";

export interface SideNavigationItem {
  exact?: boolean;
  icon?: string;
  label: React.ReactNode;
  path: string;
}

export interface SideNavigationProps {
  className?: string;
  iconSize?: number;
  menu?: SideNavigationItem[];
  style?: React.CSSProperties;
}

interface SideNavigationState {
  icon: string;
  stick: boolean;
}

/**
 * Vertical navigation with a toggleable sticky mode for compact layouts.
 *
 * @example
 * ```tsx
 * <SideNavigation
 *   menu={[
 *     { label: "Home", path: "/", icon: "home" },
 *     { label: "Profile", path: "/profile", icon: "user" },
 *   ]}
 * />
 * ```
 */
export default class SideNavigation extends React.Component<
  SideNavigationProps,
  SideNavigationState
> {
  static jsClass = "SideNavigation";

  static defaultProps: SideNavigationProps = {
    className: "",
    style: {},
    menu: [],
    iconSize: 40,
  };

  state: SideNavigationState = {
    stick: false,
    icon: "chevron-right",
  };

  stick = (): void => {
    this.setState(
      ({ stick }) => ({
        stick: !stick,
        icon: !stick ? "thumb-tack" : "chevron-right",
      }),
      () => window.focus()
    );
  };

  override render(): React.ReactNode {
    const { menu = [], iconSize = 40, className = "", style = {} } = this.props;
    const { stick, icon } = this.state;
    const cn = [SideNavigation.jsClass, className];
    if (stick) cn.push("stick");

    return React.createElement(
      "div",
      { className: cn.filter(Boolean).join(" "), style },
      React.createElement(
        "ul",
        { className: "nav flex-column" },
        React.createElement(
          "li",
          { className: "nav-item" },
          React.createElement(
            "div",
            { className: "nav-link clearfix px-0" },
            React.createElement(
              "div",
              {
                style: { width: iconSize, height: iconSize },
                className: "d-flex justify-content-end align-items-center float-right",
              },
              React.createElement(
                "span",
                {
                  className: "wrap-collapse-arrow",
                  style: { cursor: "pointer" },
                  onClick: this.stick,
                },
                React.createElement(Icons, { icon, className: "collapse-arrow" })
              )
            )
          )
        ),
        menu.map((item, i) =>
          React.createElement(
            "li",
            { className: "nav-item", key: i },
            React.createElement(
              NavLink,
              {
                to: item.path,
                className: ({ isActive }) =>
                  `nav-link${isActive ? " active" : ""}`,
                end: item.exact,
              },
              React.createElement(Icons, {
                icon: item.icon,
                inline: false,
                width: iconSize,
                height: iconSize,
              }),
              React.createElement(
                "span",
                { className: "text-collapse" },
                item.label
              )
            )
          )
        )
      )
    );
  }
}
