import ResizeSensor from "css-element-queries/src/ResizeSensor";

import { eventHandler } from "dbl-utils";

import ComplexComponent from "./complex-component";

export default class ComplexResponsiveComponent extends ComplexComponent {

  static jsClass = 'ComplexResponsive';
  static defaultProps = {
    ...ComplexComponent.defaultProps,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    }
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.ref) this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    clearTimeout(this.onResizeTimeout);
    if (this.resizeSensor) this.resizeSensor.detach();
  }

  onResize = () => {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      if (!this.ref.current) return;
      let { offsetWidth: width, offsetHeight: height } = this.ref.current;
      if (typeof this.props.onResize === 'function') {
        this.props.onResize({ width, height });
      }
      // TODO: no se toma en cuenta el ordenamiento de los breakpoints, ordenarlos
      //       y buscar la manera de empatar automagicamente con sass $container-max-widths
      this.breakpoint = Object.keys(this.props.breakpoints)
        .filter(br => width >= this.props.breakpoints[br])
        .pop();
      eventHandler.dispatch('resize.' + this.props.name, {
        width, height,
        breakpoint: this.breakpoint
      });
      this.setState({ localClasses: [this.breakpoint, 'animate'].flat().join(' ') });
    }, 200);
  }

}