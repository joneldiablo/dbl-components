import React from "react";
import { NavLink, type NavLinkProps } from "react-router-dom";
import type { Location } from "react-router";
import { eventHandler, deepMerge, splitAndFlat } from "dbl-utils";
import { extractNodeString } from "dbl-utils/extract-react-node-text";

import Icons, { type IconsProps } from "../media/icons";
import Action, { type ActionProps } from "../actions/action";
import JsonRender from "../json-render";
import Component, { type ComponentProps, type ComponentState } from "../component";
import FloatingContainer from "../containers/floating-container";
import type { Classes } from "../prop-types";
import {
  bootstrapDependencyError,
  loadBootstrapCollapse,
} from "../utils/bootstrap";

type BootstrapCollapseConstructor = Awaited<ReturnType<typeof loadBootstrapCollapse>>;
type BootstrapCollapseInstance = BootstrapCollapseConstructor extends new (...args: any[]) => infer R
  ? R
  : any;

export interface NavigationMenuItem {
  name: string;
  label: React.ReactNode;
  path?: string;
  to?: string;
  href?: string;
  menu?: NavigationMenuItem[];
  parent?: NavigationMenuItem;
  icon?: string | false;
  iconProps?: Partial<IconsProps> & Record<string, unknown>;
  iconClasses?: Classes;
  itemClasses?: Classes;
  itemProps?: Record<string, unknown>;
  floatingClasses?: Classes;
  caretClasses?: Classes;
  activeCaretClasses?: Classes;
  classes?: Classes;
  content?: [unknown, unknown] | React.ReactNode;
  disabled?: boolean;
  strict?: boolean;
  end?: boolean;
  open?: boolean;
  title?: string;
  hasAnActive?: boolean;
  active?: boolean;
}

export interface NavigationProps extends ComponentProps {
  menu?: NavigationMenuItem[];
  caretIcons?: [string, string];
  navLink?: boolean;
  activeClasses?: string;
  inactiveClasses?: string;
  pendingClasses?: string;
  transitioningClasses?: string;
  linkClasses?: Classes;
  caretClasses?: Classes;
  activeCaretClasses?: Classes;
  itemTag?: React.ElementType;
  itemClasses?: Classes;
  floatingClasses?: Classes;
  iconClasses?: Classes;
  iconProps?: Partial<IconsProps> & Record<string, unknown>;
  toggle?: string;
  open?: boolean;
  disabled?: boolean;
  location?: Location;
  mutations?: (
    key: string,
    item: NavigationMenuItem
  ) => Partial<NavigationMenuItem> | void;
}

export interface NavigationState extends ComponentState {
  carets: Record<string, string>;
  open: boolean;
}

type RouterLinkProps = (NavLinkProps & { strict?: boolean }) & {
  id: string;
  style: React.CSSProperties;
};

interface NavigationCollapseControl {
  ref: HTMLElement;
  item: NavigationMenuItem;
  submenuOpen: boolean;
  collapse?: BootstrapCollapseInstance;
}

const CLASSNAME_SEPARATOR = " ";

/**
 * Action wrapper that renders a toggle button using the navigation icon.
 *
 * @example
 * ```tsx
 * <ToggleTextNavigation name="menu" icon="menu" />
 * ```
 */
export class ToggleTextNavigation extends Action {
  declare props: ActionProps;
  static override jsClass = "ToggleTextNavigation";

  override content(): React.ReactNode {
    const icon = typeof this.props.icon === "string" ? this.props.icon : undefined;
    return React.createElement(Icons, { icon });
  }
}

/**
 * Navigation component capable of rendering nested menu structures with
 * collapsible and floating submenus.
 *
 * @example
 * ```tsx
 * <Navigation
 *   name="sidebar"
 *   location={location}
 *   menu={[
 *     { name: "dashboard", label: "Dashboard", to: "/" },
 *     {
 *       name: "settings",
 *       label: "Settings",
 *       menu: [{ name: "profile", label: "Profile", to: "/profile" }],
 *     },
 *   ]}
 * />
 * ```
 */
export default class Navigation<
  P extends NavigationProps = NavigationProps,
  S extends NavigationState = NavigationState
> extends Component<P, S> {
  declare props: P;
  declare state: S;
  static override jsClass = "Navigation";

  static override defaultProps: Partial<NavigationProps> = {
    ...Component.defaultProps,
    menu: [],
    caretIcons: ["angle-up", "angle-down"],
    navLink: true,
    activeClasses: "active",
    inactiveClasses: "",
    pendingClasses: "pending",
    transitioningClasses: "transitioning",
    itemTag: "div",
    itemClasses: "",
    floatingClasses: "",
    iconClasses: "mx-2",
  };

  override tag: React.ElementType = "nav";
  events: Array<[string, (...args: unknown[]) => void]> = [];
  activeElements: Record<string, boolean> = {};
  flatItems: Record<string, NavigationMenuItem> = {};
  collapses: React.MutableRefObject<Record<string, NavigationCollapseControl>> = {
    current: {},
  };
  itemsRefs: React.MutableRefObject<Record<string, HTMLElement | null>> = {
    current: {},
  };
  jsonRender: JsonRender;
  pathname = "";
  activeItem?: NavigationMenuItem;
  private CollapseCtor?: BootstrapCollapseConstructor | null;
  private isComponentMounted = false;

  constructor(props: P) {
    super(props);
    const open = typeof props.open !== "boolean" || props.open;
    this.state = {
      ...this.state,
      carets: {},
      open,
      localClasses: `nav ${open ? "label-show" : "label-collapsed"}`,
    };

    this.jsonRender = new JsonRender(props, () => undefined);
    this.events = [["location", (location: unknown) => this.onChangeLocation(location as Location)]];
    if (props.toggle) {
      this.events.push([props.toggle, this.onToggleBtn]);
    }

    this.hide = this.hide.bind(this);
    this.link = this.link.bind(this);
    this.onToggleBtn = this.onToggleBtn.bind(this);
  }

  private get currentLocation(): Location {
    if (this.props.location) return this.props.location;
    const fallback = typeof window !== "undefined" ? window.location : { pathname: "" };
    return fallback as Location;
  }

  override componentDidMount(): void {
    this.isComponentMounted = true;
    this.findFirstActive(this.props.menu ?? []);
    this.events.forEach((evt) => eventHandler.subscribe(...evt, this.name));
    void this.ensureCollapse();
  }

  override componentDidUpdate(prevProps: P): void {
    if (typeof this.props.open === "boolean" && prevProps.open !== this.props.open) {
      this.toggleText(this.props.open);
    }

    if (prevProps.toggle !== this.props.toggle) {
      if (prevProps.toggle) {
        eventHandler.unsubscribe(prevProps.toggle, this.name);
        const index = this.events.findIndex(([evtName]) => evtName === prevProps.toggle);
        if (index !== -1) this.events.splice(index, 1);
      }

      if (this.props.toggle && !this.events.some(([evt]) => evt === this.props.toggle)) {
        this.events.push([this.props.toggle, this.onToggleBtn]);
        eventHandler.subscribe(this.props.toggle, this.onToggleBtn, this.name);
      }
    }
  }

  override componentWillUnmount(): void {
    this.isComponentMounted = false;
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.name));
  }

  private async ensureCollapse(): Promise<BootstrapCollapseConstructor | null> {
    if (this.CollapseCtor) return this.CollapseCtor;
    try {
      const ctor = await loadBootstrapCollapse();
      if (!this.isComponentMounted) return null;
      this.CollapseCtor = ctor;
      this.clearDependencyError();
      return ctor;
    } catch (error) {
      if (this.isComponentMounted) {
        this.setDependencyError(bootstrapDependencyError("collapse"));
      }
      return null;
    }
  }

  findFirstActive(menu: NavigationMenuItem[], parent?: NavigationMenuItem): NavigationMenuItem | undefined {
    let found: NavigationMenuItem | undefined;
    for (const item of menu) {
      item.parent = parent;
      this.flatItems[item.name] = item;
      item.hasAnActive = false;
      if (this.currentLocation.pathname === (item.path ?? item.to)) {
        this.onChangeRoute(this.currentLocation);
        found = item;
        break;
      }
      if (item.menu?.length) {
        found = this.findFirstActive(item.menu, item);
        if (found) break;
      }
    }
    this.onChangeLocation(this.currentLocation);
    return found;
  }

  onChangeRoute(location: Location, action?: unknown): void {
    this.pathname = location.pathname;
    eventHandler.dispatch(this.props.name, {
      pathname: this.pathname,
      item: this.activeItem,
      open: this.state.open,
      action,
    });
  }

  onToggleBtn(): void {
    this.toggleText();
  }

  toggleText(open: boolean = !this.state.open): void {
    this.setState(
      {
        open,
        localClasses: open ? "nav label-show" : "nav label-collapsed",
      },
      () =>
        eventHandler.dispatch(this.props.name, {
          pathname: this.pathname,
          item: this.activeItem,
          open: this.state.open,
        })
    );
  }

  collapseRef(ref: HTMLElement | null, item: NavigationMenuItem): void {
    if (!ref) return;
    const registry = this.collapses.current[item.name];
    if (registry?.ref === ref) return;
    this.collapses.current[item.name] = {
      ref,
      item,
      submenuOpen: false,
    };
  }

  onToggleSubmenu(event: React.MouseEvent<HTMLElement>, item: NavigationMenuItem): void {
    void this.handleToggleSubmenu(event, item);
  }

  private async handleToggleSubmenu(
    event: React.MouseEvent<HTMLElement>,
    item: NavigationMenuItem
  ): Promise<void> {
    if (!item.menu?.length || !this.state.open) return;
    event.stopPropagation();
    event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();

    const itemControl = this.collapses.current[item.name];
    if (!itemControl) return;

    const CollapseCtor = await this.ensureCollapse();
    if (!CollapseCtor || !this.isComponentMounted) return;
    const collapseApi = CollapseCtor as any;

    if (!itemControl.collapse) {
      itemControl.ref.removeEventListener("hidden.bs.collapse", this.hide);
      itemControl.collapse =
        typeof collapseApi.getOrCreateInstance === "function"
          ? collapseApi.getOrCreateInstance(itemControl.ref, {
              autoClose: false,
              toggle: false,
            })
          : new CollapseCtor(itemControl.ref, {
              autoClose: false,
              toggle: false,
            });
      itemControl.ref.addEventListener("hidden.bs.collapse", this.hide);
    }

    if (!itemControl.submenuOpen) {
      this.state.carets[item.name] = this.props.caretIcons?.[0] ?? "angle-up";
      this.setState({ carets: this.state.carets }, () => itemControl.collapse?.show?.());
    } else {
      Array.from(itemControl.ref.querySelectorAll(".collapse"))
        .reverse()
        .forEach((collapseEl) => {
          const instance =
            typeof collapseApi.getInstance === "function"
              ? collapseApi.getInstance(collapseEl as Element)
              : undefined;
          instance?.hide?.();
        });
      itemControl.collapse?.hide?.();
    }
    itemControl.submenuOpen = !itemControl.submenuOpen;
  }

  onToggleFloating(event: React.MouseEvent<HTMLElement>, item: NavigationMenuItem): void {
    event.stopPropagation();
    event.preventDefault();
    eventHandler.dispatch(`update.${item.name}Floating`, { open: true });
    setTimeout(() => this.forceUpdate(), 350);
  }

  hide(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target?.id) return;
    const itemName = target.id.replace(/-collapse$/, "");
    const itemControl = this.collapses.current[itemName];
    if (!itemControl) return;

    const caretClose = this.props.caretIcons?.[1] ?? "angle-down";
    itemControl.submenuOpen = false;
    this.state.carets[itemName] = caretClose;
    this.setState({ carets: this.state.carets });
  }

  setActive(name: string, isActive: boolean): false {
    this.activeElements[name] = isActive;
    return false;
  }

  hasAnActive(menuItem?: NavigationMenuItem): string | undefined {
    if (!menuItem) return undefined;
    if (!menuItem.parent) return menuItem.name;
    menuItem.parent.hasAnActive = true;
    return this.hasAnActive(menuItem.parent);
  }

  onChangeLocation(location: Location = this.currentLocation): void {
    let activeItem: NavigationMenuItem | undefined;
    Object.values(this.flatItems).forEach((item) => {
      const path = item.path ?? item.to;
      item.hasAnActive = false;
      if (path === location.pathname) activeItem = item;
    });

    if (activeItem) {
      this.activeItem = activeItem;
      this.hasAnActive(activeItem);
      if (!this.state.open && activeItem.parent) {
        eventHandler.dispatch(`update.${activeItem.parent.name}Floating`, { open: false });
      }
    }
    this.forceUpdate();
  }

  link(
    itemRaw: NavigationMenuItem | undefined,
    index: number,
    parent?: NavigationMenuItem
  ): React.ReactNode {
    if (!itemRaw) return false;

    const {
      caretIcons = ["angle-up", "angle-down"],
      navLink,
      itemTag = "div",
      linkClasses,
      activeClasses = "active",
      inactiveClasses = "",
      pendingClasses = "pending",
      transitioningClasses = "transitioning",
      iconClasses,
    } = this.props;
    const { carets, open: stateOpen } = this.state;

    const modify =
      typeof this.props.mutations === "function"
        ? this.props.mutations(`${this.props.name}.${itemRaw.name}`, itemRaw)
        : undefined;

    const base = this.flatItems[itemRaw.name] ?? {};
    const item = Object.assign(base, itemRaw, modify || {});
    const open = typeof item.open === "boolean" ? item.open : stateOpen;

    if (item.active === false) return false;

    carets[item.name] = carets[item.name] || caretIcons[1];
    this.flatItems[item.name] = item;
    item.parent = parent;

    const iconStyle: Record<string, unknown> = {
      style: { fill: "currentColor" },
    };

    const classesForIcon = splitAndFlat(
      [item.iconClasses ?? iconClasses ?? this.props.iconClasses].flat(),
      " "
    ).join(CLASSNAME_SEPARATOR);

    const labelNode =
      open || !!parent
        ? React.createElement("span", { className: "label" }, this.jsonRender.buildContent(item.label))
        : null;

    const innerNode = React.createElement(
      "span",
      {},
      item.content
        ? open
          ? this.jsonRender.buildContent(Array.isArray(item.content) ? item.content[0] : item.content)
          : this.jsonRender.buildContent(
              Array.isArray(item.content) ? item.content[1] : item.content
            )
        : React.createElement(
            React.Fragment,
            {},
            item.icon !== false &&
              React.createElement(Icons, {
                icon: item.icon ?? undefined,
                className: classesForIcon,
                title: item.title ?? extractNodeString(item.label),
                ...iconStyle,
                ...deepMerge(this.props.iconProps || {}, item.iconProps || {}),
              }),
            labelNode
          )
    );

    const disabled = item.disabled ?? this.props.disabled ?? false;

    const className = (() => {
      const cn: (string | string[])[] = [];
      if (item.classes) cn.push(item.classes as string | string[]);
      else if (linkClasses) cn.push(linkClasses as string | string[]);
      if (!(item.path || item.to)) cn.push("cursor-pointer");
      if (item.hasAnActive) {
        cn.push(splitAndFlat(["has-an-active", activeClasses], " ").join(" "));
      }
      if (navLink) cn.unshift("nav-link");
      if (item.menu?.length) cn.push("has-submenu");
      if (disabled) cn.push("disabled");
      return splitAndFlat(cn, " ").join(" ");
    })();

    if (item.path || item.to) {
      const propsLink: RouterLinkProps = {
        id: `${item.name}-link`,
        onClick: (e) => {
          if (!disabled && item.menu?.length) this.onToggleSubmenu(e, item);
        },
        to: (item.path || item.to) ?? "#",
        className: ({ isActive, isPending, isTransitioning }) =>
          splitAndFlat(
            [
              isActive ? activeClasses : inactiveClasses,
              isPending ? pendingClasses : "",
              isTransitioning ? transitioningClasses : "",
              className,
              this.setActive(item.name, isActive),
            ],
            " "
          ).join(" "),
        strict: item.strict,
        end: item.end,
        style: {},
      };

      if (item.menu?.length && open) {
        propsLink.style.paddingRight = "2.3rem";
      }

      const itemProps: Record<string, unknown> & {
        key: string;
        ref: (ref: HTMLElement | null) => void;
        className: string;
      } = {
        key: item.name,
        ...(item.itemProps || {}),
        ref: (ref) => {
          this.itemsRefs.current[item.name] = ref;
        },
        className: splitAndFlat(
          [item.itemClasses ?? this.props.itemClasses, this.activeElements[item.name] || item.hasAnActive ? "active" : ""],
          " "
        ).join(" "),
      };

    return React.createElement(
      itemTag,
      itemProps,
      React.createElement(
        "div",
        { style: { position: "relative" } },
        React.createElement(NavLink, propsLink, innerNode),
          this.renderCaret(item, open, disabled)
        ),
        this.renderSubmenu(item, open)
      );
    }

    const baseProps: ComponentProps = {
      tag: item.href ? "a" : "span",
      name: item.name,
      classes: splitAndFlat([className, inactiveClasses], " ").join(" "),
      style: {},
      _props: {
        id: `${item.name}-link`,
        href: item.href,
        target: item.href ? "_blank" : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          if (!disabled && item.menu?.length) this.onToggleSubmenu(e, item);
        },
      },
    };

    const itemProps: Record<string, unknown> & {
      key: string;
      ref: (ref: HTMLElement | null) => void;
      className: string;
    } = {
      key: item.name,
      ...(item.itemProps || {}),
      ref: (ref) => {
        this.itemsRefs.current[item.name] = ref;
      },
      className: splitAndFlat(
        [item.itemClasses ?? this.props.itemClasses, this.activeElements[item.name] || item.hasAnActive ? "active" : ""],
        " "
      ).join(" "),
    };

    return React.createElement(
      itemTag,
      itemProps,
      React.createElement(
        "div",
        { style: { position: "relative" } },
        React.createElement(Component, baseProps, innerNode),
        this.renderCaret(item, open, disabled)
      ),
      this.renderSubmenu(item, open)
    );
  }

  private renderCaret(item: NavigationMenuItem, open: boolean, disabled: boolean): React.ReactNode {
    if (!item.menu?.length) return null;

    const caretIcon = this.state.carets[item.name];
    const iconStyle: Record<string, unknown> = {
      style: { fill: "currentColor" },
    };
    const caretClasses = splitAndFlat(
      [
        "position-absolute top-50 end-0 translate-middle-y caret-icon p-1 cursor-pointer",
        this.activeElements[item.name] || item.hasAnActive
          ? item.activeCaretClasses || this.props.activeCaretClasses
          : item.caretClasses || this.props.caretClasses,
      ],
      " "
    ).join(" ");

    if (open) {
      return React.createElement(
        "span",
        {
          className: caretClasses,
          onClick: (e: React.MouseEvent<HTMLElement>) => !disabled && this.onToggleSubmenu(e, item),
        },
        React.createElement(Icons, {
          icon: caretIcon,
          ...iconStyle,
          inline: false,
          style: { width: "1.8rem", padding: ".5rem" },
          className: "rounded-circle",
        })
      );
    }

    return React.createElement(
      "span",
      {
        className: caretClasses,
        onClick: (e: React.MouseEvent<HTMLElement>) => !disabled && this.onToggleFloating(e, item),
      },
      React.createElement(Icons, {
        icon: "angle-right",
        ...iconStyle,
        inline: false,
        style: { width: "1.8rem", padding: ".5rem", transform: "scale(.8)" },
        className: "rounded-circle",
      })
    );
  }

  private renderSubmenu(item: NavigationMenuItem, open: boolean): React.ReactNode {
    if (!item.menu?.length) return null;

    if (open) {
      return React.createElement(
        "div",
        {
          ref: (ref: HTMLElement | null) => this.collapseRef(ref, item),
          id: `${item.name}-collapse`,
          className: "collapse",
        },
        this.state.carets[item.name] === (this.props.caretIcons?.[0] ?? "angle-up") &&
          item.menu.map((child, i) => this.link(child, i, item)).filter(Boolean)
      );
    }

    const floatingClasses = splitAndFlat(
      [item.floatingClasses ?? this.props.floatingClasses],
      " "
    ).join(" ");

    return (
      this.itemsRefs.current[item.name] &&
      React.createElement(
        FloatingContainer,
        {
          name: `${item.name}Floating`,
          floatAround: this.itemsRefs.current[item.name] ?? undefined,
          placement: "right",
          card: false,
          allowedPlacements: ["right", "bottom", "top"],
          classes: floatingClasses,
        },
        item.menu.map((child, i) => this.link(child, i, item)).filter(Boolean)
      )
    );
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const items = (this.props.menu ?? [])
      .map((menuItem, index) => this.link(menuItem, index))
      .filter(Boolean);
    return React.createElement(React.Fragment, {}, ...items, children);
  }
}
