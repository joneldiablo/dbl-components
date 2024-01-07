import PropTypes from 'prop-types';
import React from 'react';

export default class FullscreenContainer extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    overflow: PropTypes.string,
    style: PropTypes.object
  }

  static jsClass = 'FullscreenContainer';
  static defaultProps = {
    className: '',
    gutter: null,
    overflow: 'hidden',
    style: {}
  }

  render() {
    let { className, style, overflow, children, gutter } = this.props;
    let cn = [this.constructor.jsClass];
    if (className) cn.push(className);
    let st = Object.assign({
      overflow,
      height: gutter ? `calc(100vh - ${gutter}px)` : '100vh'
    }, style);
    return (React.createElement('div',
      { className: cn.filter(c => !!c).flat().join(' '), style: st },
      children
    ));
  }

}
