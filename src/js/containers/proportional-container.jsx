import * as React from 'react';
import Container from "./container";

export default class ProportionalContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    containerClasses: '',
    containerStyle: {},
    ratio: '100%',
    overflow: 'hidden',
    fullWidth: true
  }

  classes = 'position-relative';

  content(children = this.props.children) {
    let { ratio, overflow } = this.props;
    let paddingBottom = typeof ratio === 'number' ? (ratio * 100) + '%' : ratio;
    let st = {
      overflow,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    };
    return <>
      <div className="space" style={{ paddingBottom }} />
      <div className="inner" style={st}>
        {children}
      </div>
    </>
  }
};