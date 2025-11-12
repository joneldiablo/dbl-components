import React from "react";
import { Link } from "react-router-dom";

import Icons from "../media/icons";

export interface CardListNavigationItem {
  description?: React.ReactNode;
  icon?: string;
  image?: string;
  label: React.ReactNode;
  path: string;
}

export interface CardListNavigationProps {
  menu?: Record<string, CardListNavigationItem> | CardListNavigationItem[];
}

interface CardListNavigationState {
  type: "list" | "cards";
}

/**
 * Navigation helper that renders menu entries as cards or list items.
 *
 * @example
 * ```tsx
 * <CardListNavigation
 *   menu={{
 *     dashboard: { label: "Dashboard", path: "/", icon: "home" },
 *   }}
 * />
 * ```
 */
export default class CardListNavigation extends React.Component<
  CardListNavigationProps,
  CardListNavigationState
> {
  static jsClass = "NavListCards";

  static defaultProps: CardListNavigationProps = {
    menu: [],
  };

  state: CardListNavigationState = {
    type: "list",
  };

  private get menuEntries(): [string, CardListNavigationItem][] {
    const { menu = [] } = this.props;
    return Array.isArray(menu) ? menu.map((item, index) => [String(index), item]) : Object.entries(menu);
  }

  private renderCards(): React.ReactNode {
    return React.createElement(
      "div",
      { className: "container-fluid p-4" },
      React.createElement(
        "div",
        { className: "row gx-3" },
        this.menuEntries.map(([i, item]) =>
          React.createElement(
            "div",
            { className: "col-12 col-sm-auto", key: i },
            React.createElement(
              "div",
              {
                className: "card",
                style: item.image ? { backgroundImage: `url(${item.image})` } : undefined,
              },
              React.createElement(
                "div",
                { className: "card-body" },
                React.createElement(
                  "h5",
                  { className: "card-title nav-item" },
                  React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
                  item.label,
                  React.createElement("hr", { className: "my-1" })
                ),
                React.createElement(
                  "p",
                  { className: "card-subtitle mb-2 text-muted" },
                  item.description
                ),
                React.createElement(Link, { to: item.path, className: "stretched-link" })
              )
            )
          )
        )
      )
    );
  }

  private renderList(): React.ReactNode {
    return React.createElement(
      "ul",
      { className: "list-group list-group-flush" },
      this.menuEntries.map(([i, item]) =>
        React.createElement(
          "li",
          { key: i, className: "list-group-item" },
          React.createElement(
            Link,
            { to: item.path, className: "list-group-item-action text-decoration-none" },
            React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
            item.label,
            React.createElement(Icons, { icon: "chevron-right", className: "float-right small" })
          )
        )
      )
    );
  }

  override render(): React.ReactNode {
    return this.state.type === "list" ? this.renderList() : this.renderCards();
  }
}
