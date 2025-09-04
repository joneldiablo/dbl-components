import React, { createRef, RefObject } from "react";
import { eventHandler } from "dbl-utils";

export interface ComponentProps {
  _props?: Record<string, unknown>;
  active?: boolean;
  children?: React.ReactNode;
  classes?: string | string[] | Record<string, string | undefined>;
  name: string;
  style?: React.CSSProperties;
  tag?: React.ElementType | false;
}

export interface ComponentState {
  localClasses: string | string[];
  localStyles: React.CSSProperties;
}

/**
 * Base component that wires DBL utilities and class helpers for inheriting widgets.
 *
 * @example
 * class MyComponent extends Component<{ name: string }> {
 *   content() {
 *     return "Hello";
 *   }
 * }
 */
export default class Component<
  P extends ComponentProps = ComponentProps,
  S extends ComponentState = ComponentState
> extends React.Component<P, S> {
  static jsClass = "Component";
  static defaultProps: Partial<ComponentProps> = {
    classes: "",
    style: {},
    active: true,
  };

  tag: React.ElementType = "div";
  classes = "";
  style: React.CSSProperties = {};
  name: string;
  ready?: ReturnType<typeof setTimeout>;
  ref: RefObject<HTMLElement | null>;
  eventHandlers: Record<string, (e: React.SyntheticEvent<any>) => void>;

  state: S = {
    localClasses: "",
    localStyles: {},
  } as S;

  constructor(props: P) {
    super(props);
    this.ref = createRef<HTMLElement>();
    this.name = `${props.name}-${
      (this.constructor as typeof Component).jsClass
    }`;
    this.onEvent = this.onEvent.bind(this);
    this.eventHandlers = {
      onClick: this.onEvent,
      onChange: this.onEvent,
      onMouseOver: this.onEvent,
      onMouseOut: this.onEvent,
      onMouseEnter: this.onEvent,
      onMouseLeave: this.onEvent,
      onKeyDown: this.onEvent,
      onLoad: this.onEvent,
    };
  }

  private setClasses(classes?: string | string[]): [Set<string>, Set<string>] {
    const local =
      this.state.localClasses &&
      (Array.isArray(this.state.localClasses)
        ? this.state.localClasses
        : this.state.localClasses.split(" "));
    const setLocalClasses = new Set(local);
    if (!classes) return [setLocalClasses, new Set()];
    const setClasses = new Set(
      Array.isArray(classes)
        ? classes.flatMap((c: string) => c && c.split(" ")).filter(Boolean)
        : classes.split(" ")
    );
    return [setLocalClasses, setClasses];
  }

  toggleClasses(classes?: string | string[]): boolean {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach((c: string) => {
      if (localClasses.has(c)) localClasses.delete(c);
      else localClasses.add(c);
    });
    this.setState({
      localClasses: Array.from(localClasses).flat().filter(Boolean).join(" "),
    });
    return true;
  }

  addClasses(classes?: string | string[]): boolean {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach((c: string) => localClasses.add(c));
    this.setState({
      localClasses: Array.from(localClasses).flat().filter(Boolean).join(" "),
    });
    return true;
  }

  deleteClasses(classes?: string | string[]): boolean {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach((c: string) => localClasses.delete(c));
    this.setState({
      localClasses: Array.from(localClasses).flat().filter(Boolean).join(" "),
    });
    return true;
  }

  get componentProps(): Record<string, unknown> | undefined {
    return this.props._props;
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return children;
  }

  onEvent(e: React.SyntheticEvent<any>) {
    const { name } = this.props;
    const target = e.target as HTMLInputElement;
    eventHandler.dispatch(`${e.type}.${name}`, {
      [name]: { state: this.state, value: target?.value },
    });
  }

  render(): React.ReactElement | null {
    const { classes, style, name, tag, active = true } = this.props;
    const { localClasses, localStyles } = this.state;
    if (!this.ready) {
      this.ready = setTimeout(() => eventHandler.dispatch(`ready.${name}`), 50);
    }
    const content = this.content();
    const Tag = tag === undefined ? this.tag : tag;
    if (Tag === false) return content as any;
    const cn = [
      (this.constructor as typeof Component).jsClass,
      name,
      this.name,
      this.classes,
      localClasses,
    ];
    if (classes) {
      if (typeof classes === "string") cn.push(classes);
      else if (Array.isArray(classes))
        cn.push(classes.flat().filter(Boolean).join(" "));
      else if ((classes as any)["."]) cn.push((classes as any)["."]);
    }
    const s = Object.assign({}, this.style, localStyles, style);
    const props =
      Tag === React.Fragment
        ? {}
        : {
            className: cn.flat().filter(Boolean).join(" "),
            style: s,
            ref: this.ref,
            ...this.eventHandlers,
            ...this.componentProps,
          };

    return active
      ? React.createElement(Tag as any, props, content)
      : React.createElement(React.Fragment);
  }
}
