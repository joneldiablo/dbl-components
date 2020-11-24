import * as React from 'react';

export default class AspectRatioContainer extends React.Component {

  static defaultProps = {
    ratio: '100%',
    overflow: 'hidden',
    className: '',
    style: {}
  }

  render() {
    let { ratio, overflow, children, className, style } = this.props;
    ratio = typeof ratio === 'number' ? (ratio * 100) + '%' : ratio;
    let cn = [this.constructor.name, className].join(' ');
    let st = {
      overflow,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    };
    return <div style={{ position: 'relative' }} >
      <div className={this.constructor.name + '-space'} style={{ paddingBottom: ratio }}></div>
      <div className={cn} style={Object.assign(st, style)}>
        {children}
      </div>
    </div>
  }
};