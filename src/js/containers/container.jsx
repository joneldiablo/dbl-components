import React from "react";
import Component from "../component";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

export default class Container extends Component {

  static jsClass = 'Container';
  static defaultProps = {
    ...Component.defaultProps,
    fluid: true,
    fullWidth: false
  }

  updateSize() {
    const { fluid, fullWidth } = this.props;
    const containerType = (!fullWidth ? (fluid ? 'container-fluid' : 'container') : '');
    this.setState({ localClasses: [containerType, this.state.containerClasses].join(' ') });
  }

  onResize = () => {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      if (!this.ref.current) return;
      let { offsetWidth: width, offsetHeight: height } = this.ref.current;
      if (typeof this.props.onResize === 'function') {
        this.props.onResize({ width, height });
      } else {
        this.ref.current.dispatchEvent(new CustomEvent('resize', { detail: { width, height } }));
      }
    }, 300);
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
  }

}