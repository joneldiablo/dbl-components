import React from "react";
import Component from "../component";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

export default class Container extends Component {

  static defaultProps = {
    ...Component.defaultProps,
    fluid: true,
    fullWidth: false
  }

  onResize = () => {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
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
  }

  componentWillUnmount() {
    if (this.ref)
      clearTimeout(this.onResizeTimeout);
  }

  content(children = this.props.children) {
    const { fluid, fullWidth } = this.props;
    const containerType = (!fullWidth ? (fluid ? 'container-fluid' : 'container') : 'container-fullwidth');
    const cn = [containerType];
    return <div className={cn.join(' ')}>
      {children}
    </div>
  }
}