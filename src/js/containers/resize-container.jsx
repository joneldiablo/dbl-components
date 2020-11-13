import React from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { randomS4 } from "../functions";

export default class ResizeContainer extends React.Component {

  static defaultProps = {
    id: null,
    className: '',
    style: {}
  }

  state = {
    id: (this.props.id || this.constructor.name + '-' + randomS4())
  }

  wrapper = React.createRef();

  onResize = () => {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      let { offsetWidth: width, offsetHeight: height } = this.wrapper.current;
      this.wrapper.current.dispatchEvent(new CustomEvent('resize', { detail: { width, height } }));
    }, 200);
  }

  componentDidMount() {
    this.resizeSensor = new ResizeSensor(this.wrapper.current, this.onResize);
  }

  componentWillUnmount() {
    clearTimeout(this.onResizeTimeout);
  }

  render() {
    let { className, style } = this.props;
    let { id } = this.state;
    let cn = [this.constructor.name, className].join(' ');
    return <div id={id} ref={this.wrapper} className={cn} style={style}>
      {this.props.children}
    </div>
  }
}