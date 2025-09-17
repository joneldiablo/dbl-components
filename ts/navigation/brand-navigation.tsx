import React from "react";
import { NavLink } from "react-router-dom";
import { splitAndFlat } from "dbl-utils";

import Navigation, { type NavigationProps } from "./navigation";
import type { Classes } from "../prop-types";

export interface BrandNavigationProps extends NavigationProps {
  brandName?: React.ReactNode;
  logoClasses?: Classes;
  logoHeight?: number | string;
  logoSrc?: string | null;
  logoStyle?: React.CSSProperties;
  logoWidth?: number | string;
  path?: string;
  slogan?: React.ReactNode;
  exact?: boolean;
}

/**
 * Navigation variant that renders a branded logo and slogan before the menu.
 *
 * @example
 * ```tsx
 * <BrandNavigation
 *   name="brand-nav"
 *   brandName="DBL Components"
 *   logoSrc="/logo.svg"
 *   menu={[{ name: "home", label: "Home", to: "/" }]}
 * />
 * ```
 */
export default class BrandNavigation extends Navigation<BrandNavigationProps> {
  declare props: BrandNavigationProps;
  static override jsClass = "BrandNavigation";

  static override defaultProps: Partial<BrandNavigationProps> = {
    ...Navigation.defaultProps,
    path: "/",
    logoWidth: 40,
    logoHeight: "auto",
    logoSrc: null,
    exact: true,
  };

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      logoSrc,
      path,
      brandName,
      logoWidth,
      logoHeight,
      logoClasses,
      logoStyle,
      slogan,
      exact,
    } = this.props;

    const propsLogo = {
      src: logoSrc ?? undefined,
      alt: typeof brandName === "string" ? brandName : undefined,
      width: logoWidth,
      height: logoHeight,
      className: splitAndFlat(["mr-2", logoClasses], " ").join(" "),
      style: logoStyle,
    };

    return React.createElement(
      React.Fragment,
      {},
      React.createElement(
        NavLink,
        { className: "navbar-brand", to: path ?? "/", end: exact },
        React.createElement(
          "div",
          { className: "d-flex align-items-center" },
          logoSrc && React.createElement("img", propsLogo),
          React.createElement(
            "div",
            { className: "brand-content", style: { lineHeight: 1 } },
            React.createElement(
              "p",
              { className: "m-0" },
              React.createElement("b", { className: "brandName" }, brandName)
            ),
            React.createElement(
              "p",
              { className: "m-0" },
              React.createElement("small", { className: "slogan" }, slogan)
            )
          )
        )
      ),
      children
    );
  }
}
