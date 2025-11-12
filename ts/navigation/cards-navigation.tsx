import React from "react";
import { Link } from "react-router-dom";

import { randomS4 } from "dbl-utils";

import Icons from "../media/icons";

export interface CardsNavigationItem {
  description?: React.ReactNode;
  icon?: string;
  image?: string;
  label: React.ReactNode;
  path: string;
}

export interface CardsNavigationProps {
  closestId?: string | number;
  menu?: Record<string, CardsNavigationItem> | CardsNavigationItem[];
}

interface CardsNavigationState {
  rowCols: string;
}

interface ResizePayload {
  target?: { id?: string | number } | null;
  width?: number;
}

/**
 * Responsive navigation grid that adapts the number of visible columns.
 *
 * @example
 * ```tsx
 * <CardsNavigation
 *   menu={{ reports: { label: "Reports", path: "/reports", icon: "file" } }}
 * />
 * ```
 */
export default class CardsNavigation extends React.Component<
  CardsNavigationProps,
  CardsNavigationState
> {
  static jsClass = "CardsNavigation";

  static defaultProps: CardsNavigationProps = {
    menu: [],
  };

  state: CardsNavigationState = {
    rowCols: " row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5",
  };

  id = randomS4();

  private get menuEntries(): [string, CardsNavigationItem][] {
    const { menu = [] } = this.props;
    return Array.isArray(menu) ? menu.map((item, index) => [String(index), item]) : Object.entries(menu);
  }

  onResize = (event: CustomEvent<ResizePayload> | ResizePayload | Event): void => {
    const detail =
      (event as CustomEvent<ResizePayload>).detail ??
      (event instanceof Event ? { target: event.target as HTMLElement | null } : event);
    const targetId = detail?.target ? String((detail.target as { id?: string | number }).id ?? "") : "";
    if (String(this.props.closestId ?? "") !== targetId) return;

    const width = detail?.width ?? ((detail?.target as HTMLElement | null)?.clientWidth ?? 0);
    let rowCols = "";
    if (width >= 1400) rowCols = " row-cols-5";
    else if (width >= 1200) rowCols = " row-cols-4";
    else if (width >= 768) rowCols = " row-cols-3";
    else if (width >= 576) rowCols = " row-cols-2";
    else rowCols = "";
    this.setState({ rowCols });
  };

  override componentDidMount(): void {
    if (this.props.closestId) {
      document.addEventListener("resize", this.onResize as EventListener);
    }
  }

  override componentWillUnmount(): void {
    if (this.props.closestId) {
      document.removeEventListener("resize", this.onResize as EventListener);
    }
  }

  override render(): React.ReactNode {
    const rowClassName = `row g-3 ${this.state.rowCols}`;
    return React.createElement(
      "div",
      { className: "container-fluid p-4 nav-cards" },
      React.createElement(
        "div",
        { className: rowClassName },
        this.menuEntries.map(([i, item]) =>
          React.createElement(
            "div",
            { className: "", key: i },
            React.createElement(
              "div",
              { className: "card h-100 shadow-hover" },
              item.image
                ? React.createElement("img", {
                    src: item.image,
                    className: "card-img",
                    style: {
                      opacity: 0.3,
                      objectFit: "cover",
                      minHeight: 150,
                    },
                  })
                : React.createElement("div", {
                    className: "card-img",
                    style: { minHeight: 150 },
                  }),
              React.createElement(
                "div",
                { className: "card-img-overlay" },
                React.createElement(
                  "div",
                  { className: "card-body nav-card-body" },
                  React.createElement(
                    "h5",
                    { className: "card-title nav-item" },
                    React.createElement(Icons, { icon: item.icon, className: "mr-2" }),
                    item.label,
                    React.createElement(Icons, { icon: "chevron-right", className: "small float-right" }),
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
      )
    );
  }
}
