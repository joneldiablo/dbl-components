import * as React from 'react';

export default class AspectRatioContainer extends React.Component {

  static defaultProps = {
    ratio: '100%',
    overflow: 'hidden'
  }

  render() {
    let { ratio, overflow, children } = this.props;
    ratio = typeof ratio === 'number' ? (ratio * 100) + '%' : ratio;
    return <div className={this.constructor.name + '-wrapper'} style={this.wrapperStyle}>
      <div className={this.constructor.name + '-space'} style={{ paddingBottom: ratio }}></div>
      <div className={this.constructor.name} style={{ overflow }}>
        {children}
      </div>
    </div>
  }
};