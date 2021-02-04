import * as React from 'react';
import Container from "./container";

export default class AspectRatioContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    containerClasses: '',
    containerStyle: {},
    ratio: '100%',
    overflow: 'hidden'
  }

  content(children = this.props.children) {
    let { ratio, overflow, containerClasses, containerStyle } = this.props;
    let paddingBottom = typeof ratio === 'number' ? (ratio * 100) + '%' : ratio;
    let cn = [this.constructor.name + '-in', containerClasses];
    let st = {
      overflow,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    };
    return <div style={{ position: 'relative' }} >
      <div className={this.constructor.name + '-space'} style={{ paddingBottom }} />
      <div className={cn.join(' ')} style={Object.assign(st, containerStyle)}>
        {children}
      </div>
    </div>
  }
};