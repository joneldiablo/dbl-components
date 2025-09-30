import React, { createRef } from "react";
import Dropdown from "bootstrap/js/dist/dropdown";
import {
  NavLink as ReactRouterNavLink,
  type NavLinkProps as RRNavLinkProps,
} from "react-router-dom";

import { eventHandler } from "dbl-utils";

import Icons from "../media/icons";
import JsonRender from "../json-render";
import Component, {
  type ComponentProps,
  type ComponentState,
} from "../component";

export interface DropdownItemProps
  extends ComponentProps,
    Partial<Omit<RRNavLinkProps, "children">> {
  _component?: React.ElementType;
  badge?: React.ReactNode;
  badgeClasses?: string | string[];
  icon?: string;
  label?: React.ReactNode;
  value?: React.ReactNode;
  href?: string;
  target?: string;
}

export class DropdownItem extends Component<DropdownItemProps> {
  static override jsClass = "DropdownItem";
  static override defaultProps: Partial<DropdownItemProps> = {
    ...Component.defaultProps,
    badgeClasses: "rounded-pill bg-danger",
  };

  classes = "dropdown-item d-flex align-items-center";

  constructor(props: DropdownItemProps) {
    super(props);
    if (typeof props.to === "string") this.tag = ReactRouterNavLink;
    else if (typeof props.href === "string") this.tag = "a";
    else this.tag = "button";
    this.eventHandlers = {
      onClick: this.onClick,
    };
  }

  private onClick = (): void => {
    eventHandler.dispatch(this.props.name, {
      [this.props.name]: { value: this.props.value },
    });
  };

  override get componentProps(): Record<string, unknown> | undefined {
    if (this.tag === ReactRouterNavLink) {
      const {
        to,
        end,
        caseSensitive,
        replace,
        state,
        preventScrollReset,
        relative,
        reloadDocument,
        _component,
        ariaCurrent,
        href,
        target,
      } = this.props as DropdownItemProps & RRNavLinkProps;
      return {
        ...super.componentProps,
        className: this.props.className,
        end,
        caseSensitive,
        to,
        replace,
        state,
        preventScrollReset,
        relative,
        reloadDocument,
        component: _component,
        "aria-current": ariaCurrent,
        href,
        target,
      };
    }
    if (this.tag === "a") {
      const { href, target } = this.props;
      return { ...super.componentProps, href, target };
    }
    return { ...super.componentProps, type: "button" };
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { label, icon, badge, badgeClasses } = this.props;
    return (
      <>
        {icon && (
          <>
            <Icons icon={icon} />
            &nbsp;
          </>
        )}
        {label}
        {badge && (
          <>
            &nbsp;
            <small className={["badge ms-auto", badgeClasses]
              .flat()
              .filter(Boolean)
              .join(" ")}
            >
              {badge}
            </small>
          </>
        )}
        {children}
      </>
    );
  }
}

export interface DropdownButtonContainerProps extends ComponentProps {
  allowClose?: boolean;
  btnClasses?: string | string[];
  disabled?: boolean;
  dropdown?: Record<string, unknown>;
  dropdownClass?: boolean;
  dropdownClasses?: string | string[];
  itemClasses?: string | string[];
  label?: React.ReactNode;
  menu?: Array<React.ReactNode | Record<string, any> | string>;
  mutations?: (key: string, value: unknown) => unknown;
  value?: React.ReactNode;
  zIndex?: number;
}

interface DropdownButtonContainerState extends ComponentState {
  open: boolean;
}

export default class DropdownButtonContainer extends Component<
  DropdownButtonContainerProps,
  DropdownButtonContainerState
> {
  static override jsClass = "DropdownButtonContainer";
  static override defaultProps: Partial<DropdownButtonContainerProps> = {
    ...Component.defaultProps,
    itemClasses: "",
    dropdownClasses: "",
    dropdownClass: true,
    btnClasses: "",
    dropdown: {},
    allowClose: true,
    zIndex: 1000,
  };

  classes = "btn-group";

  protected btn = createRef<HTMLElement>();
  protected trigger: string;
  protected jsonRender: JsonRender;
  protected bsDropdown?: Dropdown;
  protected events: Array<[string, (payload: any) => void]> = [];

  constructor(props: DropdownButtonContainerProps) {
    super(props);
    this.trigger = `${props.name}Btn`;
    this.style.width = "fit-content";
    this.onBsEvents = this.onBsEvents.bind(this);
    this.events = [[`update.${props.name}`, this.onUpdate.bind(this)]];
    this.state = {
      ...this.state,
      open: false,
    };
    const { mutations, ...rest } = props;
    this.jsonRender = new JsonRender(rest, mutations);
  }

  override componentDidMount(): void {
    this.events.forEach(([evt, cb]) => eventHandler.subscribe(evt, cb));
  }

  override componentWillUnmount(): void {
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt));
    this.disposeDropdown();
  }

  private disposeDropdown(): void {
    if (this.bsDropdown) {
      this.bsDropdown.dispose();
      this.bsDropdown = undefined;
    }
    if (this.btn.current) {
      const btn = this.btn.current;
      btn.removeEventListener("hide.bs.dropdown", this.onBsEvents as EventListener);
      btn.removeEventListener("hidden.bs.dropdown", this.onBsEvents as EventListener);
      btn.removeEventListener("show.bs.dropdown", this.onBsEvents as EventListener);
      btn.removeEventListener("shown.bs.dropdown", this.onBsEvents as EventListener);
    }
  }

  protected refBtn = (ref: HTMLElement | null): void => {
    if (!ref) return;
    this.disposeDropdown();
    this.btn.current = ref;
    this.bsDropdown = Dropdown.getOrCreateInstance(ref, {
      autoClose: true,
      reference: "parent",
      display: "dynamic",
      ...this.props.dropdown,
    });

    ref.addEventListener("hide.bs.dropdown", this.onBsEvents as EventListener);
    ref.addEventListener("hidden.bs.dropdown", this.onBsEvents as EventListener);
    ref.addEventListener("show.bs.dropdown", this.onBsEvents as EventListener);
    ref.addEventListener("shown.bs.dropdown", this.onBsEvents as EventListener);
  };

  private onUpdate({ open }: { open?: boolean }): void {
    if (!this.bsDropdown || open === undefined) return;
    this.bsDropdown[open ? "show" : "hide"]();
  }

  private onBsEvents(evt: Event): void {
    const evtType = evt.type.split(".")[0];
    eventHandler.dispatch(this.props.name, {
      [this.props.name]: {
        open: evt.type.includes("shown"),
        event: evtType,
        menu: this.props.menu,
      },
    });
    if (evtType === "hidden") this.setState({ open: false });
  }

  protected onToggleDrop = (evt: React.MouseEvent<HTMLElement>): void => {
    evt.stopPropagation();
    if (!this.bsDropdown || this.props.disabled) return;
    if (this.state.open) {
      this.bsDropdown.hide();
    } else {
      this.setState({ open: true }, () => {
        this.bsDropdown?.show();
        setTimeout(() => this.bsDropdown?.update(), 400);
      });
    }
  };

  protected dropdownRender(children: React.ReactNode): React.ReactNode {
    const { menu, allowClose, itemClasses, dropdownClasses, zIndex } = this.props;
    const cn = ["dropdown-menu", dropdownClasses].flat().filter(Boolean).join(" ");
    const menuBuilt = this.state.open && Array.isArray(menu)
      ? Object.entries(menu).map(([key, item]) => {
          if (React.isValidElement(item)) return item;
          const definition =
            item === "divider"
              ? {
                  name: `divider.${key}`,
                  tag: "div",
                  divider: true,
                  classes: "dropdown-divider",
                }
              : {
                  name: (item && (item as any).name) || `${this.props.name}.${key}`,
                  ...item,
                };
          return this.jsonRender.buildContent({
            classes: itemClasses,
            tag: "div",
            ...definition,
            badge: this.jsonRender.buildContent((definition as any).badge),
            component: "DropdownItem",
          });
        })
      : [];

    const style: React.CSSProperties & Record<string, unknown> = {
      minWidth: "100%",
      zIndex,
    };
    (style as any)["--bs-dropdown-zindex"] = zIndex;

    return (
      <div
        className={cn}
        style={style}
        onClick={allowClose ? undefined : (e) => e.stopPropagation()}
        aria-labelledby={this.trigger}
      >
        {menuBuilt}
        {this.state.open && children}
      </div>
    );
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { btnClasses, label, value, disabled, dropdownClass } = this.props;
    const cn = ["btn", btnClasses];
    if (dropdownClass !== false) cn.push("dropdown-toggle");
    return (
      <>
        <button
          className={cn.flat().filter(Boolean).join(" ")}
          data-bs-toggle="dropdown"
          disabled={disabled}
          id={this.trigger}
          onClick={this.onToggleDrop}
          ref={this.refBtn}
          type="button"
        >
          {label ?? value}
        </button>
        {this.dropdownRender(children)}
      </>
    );
  }
}
