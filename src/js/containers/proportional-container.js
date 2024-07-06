import React from 'react';
import PropTypes from 'prop-types';

import Container from "./container";
import { objStringNumber, stringNumber } from '../prop-types';

export default class ProportionalContainer extends Container {

  static jsClass = 'ProportionalContainer';
  static propTypes = {
    ...Container.propTypes,
    ratio: PropTypes.oneOfType([objStringNumber, stringNumber]),
    overflow: PropTypes.string,
  }
  static defaultProps = {
    ...Container.defaultProps,
    ratio: '100%',
    overflow: 'hidden',
    fullWidth: true
  }

  classes = 'position-relative';

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;
    const { ratio, overflow, innerClasses } = this.props;
    this.ratioResponsive = typeof ratio === 'object' ? ratio[this.breakpoint] : ratio;
    const paddingBottom = typeof this.ratioResponsive === 'number' ? (this.ratioResponsive * 100) + '%' : this.ratioResponsive;
    const st = {
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