import React from "react";

import { eventHandler } from "dbl-utils";
import Component, {
  nameSuffixes,
  type ComplexComponentProps,
  type ComplexComponentState,
} from "../../complex-component";

import schema from "./panel-schema.json";

type PanelContainerMode = "push" | "reveal";

export interface PanelContainerProps extends ComplexComponentProps {
  breakpoint?: number;
  contentTop?: Record<string, unknown>;
  icon?: string;
  iconSize?: number;
  link?: string;
  logo?: string;
  type?: PanelContainerMode;
  width?: number;
  menu?: unknown[];
  classes?: {
    ".": string;
    items?: string;
    [key: string]: string | undefined;
  };
}

export interface PanelContainerState extends ComplexComponentState {
  classSet: Set<string>;
  expanded: boolean;
  fixed: boolean;
  open: boolean;
  mobile?: boolean;
  [key: string]: any;
}

/**
 * Sliding panel container with responsive behaviours and JSON-powered menu.
 */
export default class PanelContainer extends Component<PanelContainerProps> {
  declare props: PanelContainerProps;
  declare state: PanelContainerState;

  static override jsClass = "PanelContainer";
  static override defaultProps: PanelContainerProps = {
    ...Component.defaultProps,
    schema,
    definitions: {},
    breakpoint: 540,
    iconSize: 30,
    type: "push",
    width: 200,
    menu: [],
    classes: {
      ".": "",
      items: "",
    },
    rules: {
      ...nameSuffixes(["LogoLink", "LogoImg", "ContentTop", "PanelMenu", "ToggleFixed", "IconTF"]),
      $itemName: ["join", "$item/name", "Item"],
      $subitemName: ["join", "$subItem/name", "SubItem"],
      $nameSubmenu: ["join", "$item/name", "Submenu"],
      "$definitions/contentMenu": ["iterate", "$data/menu", "item"],
      "$definitions/itemContentMenu": ["iterate", "$item/menu", "item"],
      $itemBadge: ["ignore", "$item/badge", null],
      $submenu: ["if", "$item/menu", "$definitions/submenu", null],
    },
  };

  private events: Array<[string, ...unknown[]]> = [];
  private timeoutResize?: ReturnType<typeof setTimeout>;
  private touchstartX = 0;
  private touchendX = 0;

  constructor(props: PanelContainerProps) {
    super(props);
    this.events = [
      [`update.${props.name}`, this.onUpdate],
      [`${props.name}ToggleFixed`, this.onToggleFixed],
      ["location", this.onChangeLocation],
    ];
    this.eventHandlers = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd,
    };

    this.state = {
      ...(this.state as PanelContainerState),
      classSet: new Set<string>(["close"]),
      expanded: false,
      fixed: false,
      open: true,
      [`${props.name}LogoLink`]: { to: props.link || "/" },
    };
    if (props.type === "reveal") this.state.classSet.add("inset");
  }

  override componentDidMount(): void {
    super.componentDidMount();
    window.addEventListener("resize", this.onWindowResize);
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => this.onWindowResize({ target: window } as any), 150);
  }

  override componentWillUnmount(): void {
    super.componentWillUnmount();
    window.removeEventListener("resize", this.onWindowResize);
    clearTimeout(this.timeoutResize);
  }

  private onWindowResize = ({ target }: { target: Window }): void => {
    const mobile = target.innerWidth < (this.props.breakpoint ?? 540);
    if (mobile) {
      this.onMouseEnter({ force: true } as any);
      this.state.classSet.add("mobile");
      this.state.classSet.delete("inset");
    } else {
      this.onMouseLeave({ force: true } as any);
      this.state.classSet.delete("mobile");
      if (this.props.type === "reveal") this.state.classSet.add("inset");
    }
    this.onUpdate({ mobile, open: !mobile }, true);
  };

  private onChangeLocation = (): void => {
    if (this.state.mobile && this.state.open) {
      this.onUpdate({ open: false }, true);
    }
  };

  private onToggleFixed = (): void => {
    this.onUpdate({ fixed: !this.state.fixed }, true);
  };

  private onMouseEnter = (e?: { force?: boolean }): void => {
    if (!e?.force && (this.state.mobile || this.state.fixed)) return;
    this.state.classSet.add("expanded");
    this.state.classSet.delete("close");
    this.state.expanded = true;
    this.forceUpdate();
  };

  private onMouseLeave = (e?: { force?: boolean }): void => {
    if (!e?.force && (this.state.mobile || this.state.fixed)) return;
    this.state.classSet.delete("expanded");
    this.state.classSet.add("close");
    this.state.expanded = false;
    this.forceUpdate();
  };

  private onTouchStart = (e: TouchEvent | React.TouchEvent): void => {
    const touch = "changedTouches" in e ? e.changedTouches[0] : (e as TouchEvent).touches[0];
    this.touchstartX = touch?.screenX ?? 0;
  };

  private onTouchEnd = (e: TouchEvent | React.TouchEvent): void => {
    const touch = "changedTouches" in e ? e.changedTouches[0] : (e as TouchEvent).touches[0];
    this.touchendX = touch?.screenX ?? 0;
    const diff = Math.abs(this.touchendX - this.touchstartX);
    if (diff < 18) return;
    const action = this.state.mobile ? "open" : "fixed";
    if (this.touchendX < this.touchstartX) {
      this.onUpdate({ [action]: false } as Partial<PanelContainerState>, true);
    }
    if (this.touchendX > this.touchstartX) {
      this.onUpdate({ [action]: true } as Partial<PanelContainerState>, true);
    }
  };

  private onUpdate = (update: Partial<PanelContainerState>, dispatch?: boolean): void => {
    const newState: Partial<PanelContainerState> = {};
    if (typeof update.mobile !== "undefined") {
      newState.mobile = update.mobile;
    }
    if (typeof update.open !== "undefined") {
      newState.open = update.open;
    }
    if (typeof update.fixed !== "undefined") {
      if (update.fixed) this.onMouseEnter({ force: true });
      else this.onMouseLeave({ force: true });
      newState.fixed = update.fixed;
    }
    this.setState(newState);
    if (dispatch) {
      eventHandler.dispatch(this.props.name, { [this.props.name]: update });
    }
  };

  override mutations(sn: string, section: any): any {
    const { name } = this.props;
    switch (sn) {
      case `${name}LogoImg`:
        return this.state.expanded
          ? {
              classes: "logo expanded",
              _props: { src: this.props.logo, width: this.props.width },
            }
          : {
              classes: "logo",
              _props: { src: this.props.icon, width: this.props.iconSize },
            };
      case `${name}ContentTop`: {
        const active = !!this.props.contentTop;
        const content = active ? this.jsonRender.buildContent(this.props.contentTop) : null;
        return { active, content };
      }
      case `${name}IconTF`:
        return {
          icon: this.state.fixed ? "expand-unlocked" : "expand-locked",
          label: this.state.fixed ? "Permitir cerrar" : "Mantener abierto",
          activeLabel: this.state.expanded,
          iconSize: this.props.iconSize,
        };
      case `${name}ToggleFixed`:
        return { active: !this.state.mobile };
      default:
        break;
    }
    if (sn.endsWith("Submenu")) {
      return { active: this.state.expanded };
    }
    if (sn.endsWith("SubItem")) {
      const classes = section.classes;
      classes.link = "d-block ps-4 p-2";
      return {
        iconSize: this.props.iconSize,
        activeLabel: this.state.expanded,
        exact: !this.state.expanded,
        classes,
      };
    }
    if (section.component === "MenuItem") {
      return {
        iconSize: this.props.iconSize,
        activeLabel: this.state.expanded,
        exact: !this.state.expanded,
      };
    }
    return (this.state as Record<string, unknown>)[sn];
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    this.classes = Array.from(this.state.classSet).flat().join(" ");
    return super.content(children);
  }

  override render(): React.ReactElement {
    if (!this.state.open) {
      return React.createElement("div", {
        className: "panel-slide2open",
        ref: this.ref,
        onTouchStart: this.onTouchStart as any,
        onTouchEnd: this.onTouchEnd as any,
      });
    }

    return React.createElement(
      React.Fragment,
      {},
      this.state.mobile &&
        React.createElement("div", {
          className: "panel-touchClose",
          onClick: () => this.onUpdate({ open: false }, true),
        }),
      super.render()
    );
  }
}
