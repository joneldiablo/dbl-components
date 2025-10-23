import React from "react";

import { eventHandler, resolveRefs } from "dbl-utils";

import JsonRender from "../../json-render";
import Component, {
  type ComponentProps,
  type ComponentState,
} from "../../component";
import {
  bootstrapDependencyError,
  loadBootstrapOffcanvas,
} from "../../utils/bootstrap";

import schema from "./offcanvas.json";

type BootstrapOffcanvasConstructor = Awaited<ReturnType<typeof loadBootstrapOffcanvas>>;
type BootstrapOffcanvasInstance = BootstrapOffcanvasConstructor extends new (...args: any[]) => infer R
  ? R
  : any;

type OffcanvasSection = "header" | "body" | "footer" | "content";
type OffcanvasPosition = "start" | "end" | "top" | "bottom";

export interface OffcanvasContainerProps extends ComponentProps {
  bodyClasses?: string;
  closeClasses?: string;
  footerClasses?: string;
  headerClasses?: string;
  labelClasses?: string;
  label?: React.ReactNode;
  labelTag?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  offcanvas?: Record<string, unknown>;
  position?: OffcanvasPosition;
  showClose?: boolean;
  open?: boolean;
  children?: React.ReactNode;
}

interface OffcanvasContainerState extends ComponentState {
  showOffcanvas: boolean;
}

/**
 * Container that renders a Bootstrap offcanvas panel with JSON schema driven layout.
 */
export default class OffcanvasContainer extends Component<
  OffcanvasContainerProps,
  OffcanvasContainerState
> {
  declare props: OffcanvasContainerProps;

  static override jsClass = "OffcanvasContainer";
  static override defaultProps: Partial<OffcanvasContainerProps> = {
    ...Component.defaultProps,
    bodyClasses: "",
    closeClasses: "",
    footerClasses: "",
    headerClasses: "",
    labelClasses: "",
    labelTag: "h5",
    offcanvas: {},
    position: "start",
    showClose: true,
  };

  tag: React.ElementType = "aside";
  classes = "offcanvas d-flex flex-column";

  private bsEvents: Array<"show" | "shown" | "hide" | "hidden" | "hidePrevented"> = [
    "show",
    "shown",
    "hide",
    "hidden",
    "hidePrevented",
  ];

  private sections: Record<OffcanvasSection, React.ReactNode[]> = {
    header: [],
    body: [],
    footer: [],
    content: [],
  };

  private schema = resolveRefs(schema.view, {
    definitions: schema.definitions,
    props: {},
  });

  private jsonRender: JsonRender;
  private offcanvasInstance: BootstrapOffcanvasInstance | null = null;
  private OffcanvasCtor?: BootstrapOffcanvasConstructor | null;
  private isComponentMounted = false;

  constructor(props: OffcanvasContainerProps) {
    super(props);
    Object.assign(this.state, {
      showOffcanvas: !!props.open,
      localClasses: `offcanvas-${props.position ?? "start"}`,
    });
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
    this.schema = resolveRefs(schema.view, {
      definitions: schema.definitions,
      props,
    });
  }

  override get componentProps(): Record<string, unknown> | undefined {
    const props = this.props._props || {};
    return {
      tabIndex: -1,
      id: this.name,
      "aria-labelledby": `${this.props.name}-titleOffcanvas`,
      ref: this.onOffcanvasRef,
      ...props,
    };
  }

  override componentDidMount(): void {
    this.isComponentMounted = true;
    const { name } = this.props;
    eventHandler.subscribe(`update.${name}`, this.onUpdateOffcanvas, this.name);
    this.deleteClasses("offcanvas-start offcanvas-end offcanvas-top offcanvas-bottom");
    this.addClasses(`offcanvas-${this.props.position ?? "start"}`);
    void this.ensureOffcanvas();
  }

  override componentWillUnmount(): void {
    this.isComponentMounted = false;
    const { name } = this.props;
    this.destroy();
    eventHandler.unsubscribe(`update.${name}`, this.name);
  }

  private async ensureOffcanvas(): Promise<BootstrapOffcanvasConstructor | null> {
    if (this.OffcanvasCtor) return this.OffcanvasCtor;
    try {
      const ctor = await loadBootstrapOffcanvas();
      if (!this.isComponentMounted) return null;
      this.OffcanvasCtor = ctor;
      this.clearDependencyError();
      return ctor;
    } catch (error) {
      if (this.isComponentMounted) {
        this.setDependencyError(bootstrapDependencyError("offcanvas"));
      }
      return null;
    }
  }

  private onEvent = (e: Event): void => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split(".")[0] });
  };

  private onUpdateOffcanvas = async ({ open }: { open?: boolean }): Promise<void> => {
    if (typeof open === "undefined") return;
    if (open) {
      this.setState({ showOffcanvas: true });
      return;
    }

    if (!this.offcanvasInstance && this.ref.current) {
      const OffcanvasCtor = await this.ensureOffcanvas();
      if (!OffcanvasCtor) return;
      const offcanvasApi = OffcanvasCtor as any;
      this.offcanvasInstance =
        typeof offcanvasApi.getInstance === "function"
          ? offcanvasApi.getInstance(this.ref.current)
          : null;
    }
    this.offcanvasInstance?.hide?.();
    setTimeout(() => this.setState({ showOffcanvas: false }), 350);
  };

  private destroy = (): void => {
    if (this.offcanvasInstance) {
      this.offcanvasInstance.dispose?.();
      this.offcanvasInstance = null;
    }
    this.setState({ showOffcanvas: false });
  };

  private onOffcanvasRef = (refOriginal: HTMLElement | null): void => {
    if (!refOriginal) return;
    this.ref.current = refOriginal;
    void this.attachOffcanvas(refOriginal);
  };

  private async attachOffcanvas(refOriginal: HTMLElement): Promise<void> {
    if (!this.isComponentMounted) return;
    if (this.offcanvasInstance && this.ref.current === refOriginal) {
      if (this.state.showOffcanvas) this.offcanvasInstance.show?.();
      return;
    }
    const OffcanvasCtor = await this.ensureOffcanvas();
    if (!OffcanvasCtor || !this.isComponentMounted) return;

    const offcanvasApi = OffcanvasCtor as any;
    this.offcanvasInstance =
      typeof offcanvasApi.getOrCreateInstance === "function"
        ? offcanvasApi.getOrCreateInstance(refOriginal, this.props.offcanvas)
        : new OffcanvasCtor(refOriginal, this.props.offcanvas);

    this.bsEvents.forEach((event) =>
      refOriginal.addEventListener(`${event}.bs.offcanvas`, this.onEvent, false)
    );
    refOriginal.addEventListener("hidden.bs.offcanvas", this.destroy, false);
    if (this.state.showOffcanvas) this.offcanvasInstance?.show?.();
  }

  private get headerContent(): React.ReactNode[] | false {
    return this.sections.header.length ? this.sections.header : false;
  }

  private get bodyContent(): React.ReactNode[] | false {
    return this.sections.body.length ? this.sections.body : false;
  }

  private get footerContent(): React.ReactNode[] | false {
    return this.sections.footer.length ? this.sections.footer : false;
  }

  private get contentOffcanvas(): React.ReactNode[] | false {
    return this.sections.content.length ? this.sections.content : false;
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    this.sections = React.Children.toArray(children).reduce(
      (reducer, child) => {
        if (!child) return reducer;
        if (["string", "number", "boolean"].includes(typeof child)) {
          reducer.body.push(child);
          return reducer;
        }
        if (!React.isValidElement(child)) return reducer;
        const childCondition = !child.props?.style?.["--component-name"];
        const childConf = (
          childCondition && React.isValidElement(child)
            ? child
            : child.props.children
        ) as React.ReactElement<{ container?: OffcanvasSection }>;
        const container =
          (childConf?.props?.container &&
            reducer[childConf.props.container as OffcanvasSection]) ||
          reducer.content;
        container.push(child);
        return reducer;
      },
      { header: [] as React.ReactNode[], body: [] as React.ReactNode[], footer: [] as React.ReactNode[], content: [] as React.ReactNode[] }
    );
    return this.jsonRender.buildContent(this.schema);
  }

  override render(): React.ReactElement | null {
    return this.state.showOffcanvas ? super.render() : React.createElement(React.Fragment);
  }

  private mutations(name: string, conf: any): any {
    const rn = name.replace(`${this.props.name}-`, "");
    switch (rn) {
      case "headerOffcanvas":
        return {
          active: this.props.showClose || !!this.props.label || !!this.headerContent,
          classes: [conf.classes, this.props.headerClasses],
        };
      case "titleOffcanvas":
        return {
          active: !!this.props.label,
          tag: this.props.labelTag,
          classes: [conf.classes, this.props.labelClasses],
          content: this.props.label,
        };
      case "closeOffcanvas":
        return {
          active: this.props.showClose,
          classes: [conf.classes, this.props.closeClasses],
        };
      case "contentHO":
        return {
          active: !!this.headerContent,
          tag: React.Fragment,
          content: this.headerContent,
        };
      case "bodyOffcanvas":
        return {
          active: !!this.bodyContent,
          classes: [conf.classes, this.props.bodyClasses],
          content: this.bodyContent,
        };
      case "footerOffcanvas":
        return {
          active: !!this.footerContent,
          classes: [conf.classes, this.props.footerClasses],
          content: this.footerContent,
        };
      case "contentOffcanvas":
        return {
          active: !!this.contentOffcanvas,
          tag: React.Fragment,
          content: this.contentOffcanvas,
        };
      default:
        break;
    }
    return false;
  }
}
