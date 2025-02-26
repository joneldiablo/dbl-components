import PropTypes from 'prop-types';
import React from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

import { randomS4 } from "dbl-utils";

export default class AutoResponsiveContainer extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    id: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    onResize: PropTypes.func,
    style: PropTypes.object,
  }

  static jsClass = 'AutoResponsiveContainer';
  static defaultProps = {
    id: null,
    className: '',
    style: {},
    onResize: null
  }

  state = {
    id: (this.props.id || this.constructor.jsClass + '-' + randomS4())
  }

  wrapper = React.createRef();

  onResize = () => {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      let { offsetWidth: width, offsetHeight: height } = this.wrapper.current;
      if (typeof this.props.onResize === 'function') {
        this.props.onResize({ width, height });
      } else {
        this.wrapper.current.dispatchEvent(new CustomEvent('resize', { detail: { width, height } }));
      }
    }, 300);
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
    let cn = [this.constructor.jsClass, className].flat().join(' ');
    return React.createElement('div',
      { id: id, ref: this.wrapper, className: cn, style: style },
      this.props.children
    );
  }
}