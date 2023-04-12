import ResizeSensor from "css-element-queries/src/ResizeSensor";

import Component from "../component";
import eventHandler from "../functions/event-handler";

export default class Container extends Component {

  static jsClass = 'Container';
  static defaultProps = {
    ...Component.defaultProps,
    fluid: true,
    fullWidth: false,
    breakpoints: {
      xs: 0,
      sm: 540,
      md: 720,
      lg: 960,
      xl: 1140,
      xxl: 1320
    }
  }

  breakpoint = false;

  updateSize() {
    const { fluid, fullWidth } = this.props;
    const containerType = (!fullWidth ? (fluid ? 'container-fluid' : 'container') : '');
    this.setState({ localClasses: [containerType, this.breakpoint, 'animate'].join(' '), loaded: true });
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
      this.updateSize();
    }, 200);
  }

  componentDidMount() {
    if (this.ref)
      this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    this.updateSize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fluid != this.props.fluid || prevProps.fullWidth != this.props.fullWidth) {
      this.updateSize();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.onResizeTimeout);
    if (this.resizeSensor)
      this.resizeSensor.detach();
  }

  content(children = this.props.children) {
    return !!this.state.loaded && children;
  }

}