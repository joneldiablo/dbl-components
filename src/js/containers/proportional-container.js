import * as React from 'react';
import Container from "./container";

export default class ProportionalContainer extends Container {

  static jsClass = 'ProportionalContainer';
  static defaultProps = {
    ...Container.defaultProps,
    ratio: '100%',
    overflow: 'hidden',
    fullWidth: true
  }

  classes = 'position-relative';

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;
    let { ratio, overflow, innerClasses } = this.props;
    let paddingBottom = typeof ratio === 'number' ? (ratio * 100) + '%' : ratio;
    let st = {
      overflow,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    };
    return React.createElement(React.Fragment, {},
      React.createElement('div', { className: "space", style: { paddingBottom } }),
      React.createElement('div', { className: ['inner', innerClasses].flat().join(' '), style: st },
        children
      )
    );
  }
};