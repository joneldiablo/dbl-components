import React from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

import Component from "../component";
import eventHandler from "../functions/event-handler";
import Icons from "../media/icons";


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
  waitBreakpoint = <Icons icon="spinner" classes="spinner" />;

  constructor(props) {
    super(props);
    this.onResize = this.onResize.bind(this);
  }

  updateSize() {
    const { fluid, fullWidth } = this.props;
    const containerType = (!fullWidth ? (fluid ? 'container-fluid' : 'container') : '');
    const localClasses = new Set(this.state.localClasses.split(' '));
    [containerType, this.breakpoint, 'animate'].forEach(c => localClasses.add(c));
    this.setState({ localClasses: Array.from(localClasses).flat().join(' ') });
  }

  onResize(firstTime) {
    const resizingFunc = () => {
      if (!this.ref.current) return;

      let width, height;
      if (firstTime === true) ({ offsetWidth: width, offsetHeight: height } = this.ref.current);
      else ({ width, height } = firstTime);

      // TODO: no se toma en cuenta el ordenamiento de los breakpoints, ordenarlos
      //       y buscar la manera de empatar automagicamente con sass $container-max-widths
      this.breakpoint = Object.keys(this.props.breakpoints)
        .filter(br => width >= this.props.breakpoints[br])
        .pop();
      this.orientation = width >= height ? 'landscape' : 'portrait';
      const resp = {
        width, height,
        breakpoint: this.breakpoint,
        orientation: this.orientation
      };

      if (typeof this.props.onResize === 'function') {
        this.props.onResize(resp);
      }
      eventHandler.dispatch('resize.' + this.props.name, resp);
      this.updateSize();

    }

    if (firstTime === true) {
      resizingFunc();
      eventHandler.dispatch('ready.' + this.props.name);
    } else {
      clearTimeout(this.onResizeTimeout);
      this.onResizeTimeout = setTimeout(resizingFunc, 200);
    }

  }

  componentDidMount() {
    if (this.ref)
      this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    this.onResize(true);

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
    return !!this.breakpoint ? children : this.waitBreakpoint;
  }

}