import React from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "bootstrap/js/dist/dropdown";

import Navigation, { type NavigationMenuItem, type NavigationProps } from "./navigation";
import Icons from "../media/icons";
import Svg from "../media/svg";
import ProportionalContainer from "../containers/proportional-container";
import components from "../components";

export interface HeaderNavigationMenuItem extends NavigationMenuItem {
  attributes?: Record<string, unknown>;
  component?: string;
  divider?: boolean;
  dropdown?: boolean;
  exact?: boolean;
  image?: Record<string, unknown>;
  svg?: Record<string, unknown>;
  menu?: HeaderNavigationMenuItem[];
}

export interface HeaderNavigationProps extends NavigationProps {
  className?: string | string[];
  classes?: string | string[];
  icon?: string;
  img?: string;
  label?: React.ReactNode;
  menu?: HeaderNavigationMenuItem[];
  style?: React.CSSProperties;
  svg?: Record<string, unknown>;
}

/**
 * Header navigation rendered as a Bootstrap navbar with dropdown support.
 *
 * @example
 * ```tsx
 * <HeaderNavigation
 *   name="header"
 *   label="DBL"
 *   menu=[
 *     { name: "profile", label: "Profile", path: "/profile" },
 *     { name: "settings", label: "Settings", path: "/settings" },
 *   ]
 * />
 * ```
 */
export default class HeaderNavigation extends Navigation<HeaderNavigationProps> {
  declare props: HeaderNavigationProps;
  static override jsClass = "HeaderNavigation";

  dropdowns: Dropdown[] = [];

  override componentWillUnmount(): void {
    super.componentWillUnmount();
    this.dropdowns.forEach((dropdown) => dropdown.dispose());
  }

  dropdownInit = (ref: HTMLElement | null): void => {
    if (ref) this.dropdowns.push(new Dropdown(ref));
  };

  menuItem = ([key, item]: [string, HeaderNavigationMenuItem]): React.ReactNode => {
    if (item.divider) {
      return React.createElement(
        "li",
        { key },
        React.createElement("hr", { className: "dropdown-divider" })
      );
    }

    if (item.component) {
      const Component = (components as Record<string, React.ComponentType<any>>)[item.component];
      return (
        Component &&
        React.createElement(
          "li",
          { key },
          React.createElement(Component, { ...(item.attributes || {}) })
        )
      );
    }

    const classNames = [item.dropdown ? "dropdown-item" : "nav-item"] as (string | undefined)[];
    if (item.menu && item.menu.length) classNames.push("dropdown");

    const content = React.createElement(
      React.Fragment,
      {},
      item.icon && React.createElement(Icons, { icon: item.icon, className: "mr-1" }),
      (item.svg || item.image) &&
        React.createElement(
          ProportionalContainer,
          { name: `${item.name}-media`, classes: "rounded-circle mr-1" },
          item.svg && React.createElement(Svg, { ...(item.svg || {}), className: "w-100 h-100" }),
          item.image &&
            React.createElement("img", {
              ...(item.image || {}),
              className: "w-100 h-100 img-cover",
            })
        ),
      React.createElement(
        "span",
        { className: item.icon && !item.dropdown ? "d-none d-sm-inline" : "" },
        item.label
      )
    );

    return React.createElement(
      "li",
      { key, className: classNames.filter(Boolean).join(" ") },
      item.menu && item.menu.length
        ? React.createElement(
            "a",
            {
              ref: this.dropdownInit,
              className: "nav-link dropdown-toggle",
              href: "#",
              id: item.name,
              role: "button",
              "data-toggle": "dropdown",
              "aria-expanded": "false",
            },
            content
          )
        : React.createElement(
            NavLink,
            { to: item.path ?? item.to ?? "#", end: item.exact, className: "nav-link" },
            content
          ),
      item.menu && item.menu.length
        ? React.createElement(
            "ul",
            { className: "dropdown-menu dropdown-menu-right", "aria-labelledby": item.name },
            item.menu.map((entry, index) =>
              this.menuItem([
                `${key}-${index}`,
                { dropdown: true, ...entry },
              ])
            )
          )
        : null
    );
  };

  override render(): React.ReactElement {
    const { className, classes, style, menu, label, icon, svg, img } = this.props;
    const cn = [HeaderNavigation.jsClass, "shadow-sm sticky-top"] as (string | string[])[];
    if (className) cn.push(className);
    if (classes) cn.push(classes);

    return React.createElement(
      "nav",
      { className: cn.filter(Boolean).flat().join(" "), style },
      React.createElement(
        "div",
        { className: "py-2 position-relative" },
        React.createElement(
          "div",
          { className: "position-absolute left-50 left-sm-0 top-50 translate-middle translatey-sm-middle mx-auto mx-sm-3" },
          icon && React.createElement(Icons, { icon, inline: false }),
          svg && React.createElement(Svg, { ...(svg || {}) }),
          img && React.createElement("img", { src: img }),
          label && React.createElement("span", null, label)
        ),
        React.createElement(
          "div",
          { className: "ml-auto mr-3", style: { width: "fit-content" } },
          menu && menu.length
            ? React.createElement(
                "ul",
                { className: "navbar-nav" },
                menu.map((entry, index) => this.menuItem([String(index), entry]))
              )
            : null
        )
      )
    );
  }
}
