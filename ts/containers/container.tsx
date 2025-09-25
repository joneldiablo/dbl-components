import React from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { eventHandler } from "dbl-utils";

import Component, { ComponentProps } from "../component";
import Icons from "../media/icons";

export interface ContainerProps extends ComponentProps {
  fluid?: boolean;
  fullWidth?: boolean;
  breakpoints?: Record<string, number>;
  xsClasses?: string | string[];
  smClasses?: string | string[];
  mdClasses?: string | string[];
  lgClasses?: string | string[];
  xlClasses?: string | string[];
  xxlClasses?: string | string[];
  onResize?: (resp: {
    width: number;
    height: number;
    breakpoint?: string;
    orientation?: string;
  }) => void;
}

export default class Container extends Component<ContainerProps> {
  static jsClass = "Container";
  static defaultProps: Partial<ContainerProps> = {
    ...Component.defaultProps,
    fluid: true,
    fullWidth: false,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  };

  breakpoint?: string;
  orientation?: string;
  waitBreakpoint = React.createElement(Icons, {
    icon: "spinner",
    classes: "spinner",
  });
  resizeSensor?: ResizeSensor;
  onResizeTimeout?: ReturnType<typeof setTimeout>;
  width?: number;
  height?: number;

  constructor(props: ContainerProps) {
    super(props);
    this.onResize = this.onResize.bind(this);
  }

  get componentProps() {
    return {
      id: this.props.name,
      ...this.props._props,
    };
  }

  updateSize(): void {
    const { fluid, fullWidth, breakpoints = {} } = this.props;
    const containerType = !fullWidth
      ? fluid
        ? "container-fluid"
        : "container"
      : "";
    const localClasses = new Set(
      String(this.state.localClasses).split(" ")
    );
    Object.keys(breakpoints).forEach((br) => localClasses.delete(br));
    [containerType, this.breakpoint, "animate"].forEach((c) =>
      c && localClasses.add(c)
    );
    this.state.localClasses = Array.from(localClasses).flat().join(" ");
    const bpKey = `${this.breakpoint}Classes` as keyof ContainerProps;
    if (!this.addClasses(this.props[bpKey] as string | string[] | undefined)) {
      this.setState({
        localClasses: this.state.localClasses,
      });
    }
  }

  onResize(firstTime: true | { width: number; height: number }): void {
    const resizingFunc = () => {
      if (!this.ref.current) return;

      let width: number;
      let height: number;
      if (firstTime === true) {
        ({ offsetWidth: width, offsetHeight: height } = this.ref.current);
      } else {
        ({ width, height } = firstTime);
      }

      this.breakpoint = Object.keys(this.props.breakpoints || {})
        .filter((br) => width >= (this.props.breakpoints as Record<string, number>)[br])
        .pop();
      this.orientation = width >= height ? "landscape" : "portrait";
      this.width = width;
      this.height = height;
      const resp = {
        width,
        height,
        breakpoint: this.breakpoint,
        orientation: this.orientation,
      };

      if (typeof this.props.onResize === "function") {
        this.props.onResize(resp);
      }
      eventHandler.dispatch("resize." + this.props.name, resp);
      this.updateSize();
    };

    if (firstTime === true) {
      resizingFunc();
      eventHandler.dispatch("ready." + this.props.name);
    } else {
      clearTimeout(this.onResizeTimeout);
      this.onResizeTimeout = setTimeout(resizingFunc, 200);
    }
  }

  componentDidMount(): void {
    if (this.ref.current)
      this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    this.onResize(true);
  }

  componentDidUpdate(prevProps: ContainerProps): void {
    if (
      prevProps.fluid !== this.props.fluid ||
      prevProps.fullWidth !== this.props.fullWidth
    ) {
      this.updateSize();
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this.onResizeTimeout);
    if (this.resizeSensor) this.resizeSensor.detach();
  }

  content(children = this.props.children): React.ReactNode {
    return this.breakpoint ? children : this.waitBreakpoint;
  }
}

