import React from "react";
import PropTypes from 'prop-types';

export default class Svg extends React.Component {

  static propTypes = {
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    classes: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    href: PropTypes.string,
    inline: PropTypes.bool,
    style: PropTypes.object
  }

  static jsClass = 'Svg';
  static defaultProps = {
    className: '',
    classes: '',
    href: '',
    inline: true,
    style: {}
  }

  render() {
    let { style, href, className, classes, inline, ...props } = this.props;
    // first element empty to generate an space
    const cn = [this.constructor.jsClass];
    if (className) cn.push(className);
    if (classes) cn.push(classes);
    if (inline) cn.push('icon-inline');
    return React.createElement('svg',
      { className: cn.filter(c => !!c).flat().join(' '), style, ...props },
      React.createElement('use', { href })
    );
  }
}
