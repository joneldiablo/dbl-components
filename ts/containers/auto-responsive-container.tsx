import React from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

import { randomS4 } from "dbl-utils";

export interface AutoResponsiveContainerProps {
  children?: React.ReactNode;
  className?: string | string[];
  id?: string | string[] | null;
  onResize?: (size: { width: number; height: number }) => void;
  style?: React.CSSProperties;
}

interface AutoResponsiveContainerState {
  id: string;
}

export default class AutoResponsiveContainer extends React.Component<
  AutoResponsiveContainerProps,
  AutoResponsiveContainerState
> {
  static jsClass = "AutoResponsiveContainer";
  static defaultProps: Partial<AutoResponsiveContainerProps> = {
    id: null,
    className: "",
    style: {},
    onResize: null,
  };

  wrapper: React.RefObject<HTMLDivElement> = React.createRef();
  resizeSensor?: ResizeSensor;
  onResizeTimeout?: ReturnType<typeof setTimeout>;

  constructor(props: AutoResponsiveContainerProps) {
    super(props);
    const providedId = Array.isArray(props.id)
      ? props.id.join(" ")
      : typeof props.id === "string"
      ? props.id
      : undefined;
    this.state = {
      id:
        providedId ?? `${AutoResponsiveContainer.jsClass}-${randomS4()}`,
    };
  }

  componentDidMount(): void {
    if (this.wrapper.current) {
      this.resizeSensor = new ResizeSensor(this.wrapper.current, this.onResize);
    }
  }

  componentWillUnmount(): void {
    if (this.onResizeTimeout) clearTimeout(this.onResizeTimeout);
    this.resizeSensor?.detach?.();
  }

  private readonly onResize = (): void => {
    if (this.onResizeTimeout) clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      const element = this.wrapper.current;
      if (!element) return;
      const { offsetWidth: width, offsetHeight: height } = element;
      if (typeof this.props.onResize === "function") {
        this.props.onResize({ width, height });
      } else {
        element.dispatchEvent(
          new CustomEvent("resize", { detail: { width, height } })
        );
      }
    }, 300);
  };

  render(): React.ReactNode {
    const { className, style, children } = this.props;
    const { id } = this.state;
    const classes = [
      (this.constructor as typeof AutoResponsiveContainer).jsClass,
      className,
    ]
      .flat()
      .filter(Boolean)
      .join(" ");
    return (
      <div id={id} ref={this.wrapper} className={classes} style={style}>
        {children}
      </div>
    );
  }
}
