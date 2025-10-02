import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";

export interface FooterMenuItem
  extends Omit<Partial<NavLinkProps>, "children" | "className"> {
  label: React.ReactNode;
  path?: NavLinkProps["to"];
  exact?: boolean;
}

export type FooterMenu =
  | Array<FooterMenuItem | null | undefined | false>
  | Record<string, FooterMenuItem | null | undefined | false>;

export interface FooterContainerProps {
  classes?: string | string[];
  copyright?: React.ReactNode;
  menu?: FooterMenu;
  textOverColor?: string;
}

export default class FooterContainer extends React.Component<FooterContainerProps> {
  static jsClass = "Footer";

  static defaultProps: Partial<FooterContainerProps> = {
    textOverColor: "light",
  };

  override render(): React.ReactNode {
    const { menu, copyright, textOverColor, classes } = this.props;

    const navbarClasses = ["navbar"];
    if (textOverColor) navbarClasses.push(`navbar-${textOverColor}`);
    if (classes) {
      const extra = Array.isArray(classes) ? classes : [classes];
      navbarClasses.push(
        ...extra
          .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
          .map((value) => value.trim())
      );
    }

    const menuItems: Array<FooterMenuItem | null | undefined | false> = !menu
      ? []
      : (Array.isArray(menu)
          ? menu
          : Object.values(menu)) as Array<
          FooterMenuItem | null | undefined | false
        >;

    return (
      <footer>
        {menuItems.length > 0 ? (
          <>
            <nav className={navbarClasses.filter(Boolean).join(" ")}>
              <div className="container-fluid">
                <div className="navbar-nav">
                  {menuItems.map((item, index) => {
                    if (!item) return null;

                    const { label, path, exact, to, end, ...linkProps } = item;
                    const destination = path ?? to;
                    if (!destination) return null;

                    return (
                      <NavLink
                        key={index}
                        {...linkProps}
                        to={destination}
                        end={end ?? exact}
                        className={({ isActive }) =>
                          ["nav-link", isActive ? "active" : undefined]
                            .filter(Boolean)
                            .join(" ")
                        }
                      >
                        {label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </nav>
            <hr />
          </>
        ) : (
          <br />
        )}

        <div className="container-fluid text-muted">
          {copyright ?? (
            <>
              <small className="text-muted">{copyright}</small>
              <small className="float-right">Desarrollado por El Diablo</small>
            </>
          )}
        </div>
        <br />
      </footer>
    );
  }
}
