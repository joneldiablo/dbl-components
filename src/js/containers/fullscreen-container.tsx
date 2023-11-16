import React from 'react';

export default class FullscreenContainer extends React.Component {

  static jsClass = 'FullscreenContainer';
  static defaultProps = {
    className: '',
    overflow: 'hidden',
    gutter: null
  }

  render() {
    let { className, style, overflow, children, gutter } = this.props;
    let cn = [this.constructor.jsClass, className].join(' ');
    let st = Object.assign({
      overflow,
      height: gutter ? `calc(100vh - ${gutter}px)` : '100vh'
    }, style);
    return (<div className={cn} style={st}>
      {children}
    </div>);
  }

}
