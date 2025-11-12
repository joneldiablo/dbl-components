import ResizeSensor from "css-element-queries/src/ResizeSensor";

import { eventHandler } from "dbl-utils";

import ComplexComponent, {
  type ComplexComponentProps,
  type ComplexComponentState,
} from "./complex-component";

export interface ComplexResponsiveComponentProps
  extends ComplexComponentProps {
  breakpoints?: Record<string, number>;
  onResize?: (size: { width: number; height: number }) => void;
}

export interface ComplexResponsiveComponentState
  extends ComplexComponentState {}

export default class ComplexResponsiveComponent extends ComplexComponent<
  ComplexResponsiveComponentProps,
  ComplexResponsiveComponentState
> {
  static override jsClass = "ComplexResponsive";
  static override defaultProps: ComplexResponsiveComponentProps = {
    ...ComplexComponent.defaultProps,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  };

  private resizeSensor?: ResizeSensor;
  private onResizeTimeout?: ReturnType<typeof setTimeout>;
  private breakpoint?: string;

  override componentDidMount(): void {
    super.componentDidMount();
    if (this.ref?.current) {
      this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    }
    this.onResize();
  }

  override componentWillUnmount(): void {
    super.componentWillUnmount();
    if (this.onResizeTimeout) clearTimeout(this.onResizeTimeout);
    this.resizeSensor?.detach?.();
  }

  private readonly onResize = (): void => {
    if (this.onResizeTimeout) clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      const element = this.ref?.current as HTMLElement | null;
      if (!element) return;
      const { offsetWidth: width, offsetHeight: height } = element;
      this.props.onResize?.({ width, height });

      const breakpoints = this.props.breakpoints || {};
      this.breakpoint = Object.keys(breakpoints)
        .filter((br) => width >= (breakpoints[br] ?? 0))
        .pop();

      eventHandler.dispatch(`resize.${this.props.name}`, {
        width,
        height,
        breakpoint: this.breakpoint,
      });

      this.setState({
        localClasses: [this.breakpoint, "animate"].flat().filter(Boolean).join(" "),
      } as Partial<ComplexResponsiveComponentState>);
    }, 200);
  };
}

