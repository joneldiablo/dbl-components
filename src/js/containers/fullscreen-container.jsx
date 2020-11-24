import React from 'react';

export default class FullscreenContainer extends React.Component {

  static defaultProps = {
    className: '',
    overflow: 'hidden',
    gutter: null
  }

  render() {
    let { className, style, overflow, children, gutter } = this.props;
    let cn = [this.constructor.name, className].join(' ');
    let st = Object.assign({
      overflow,
      height: gutter ? `calc(100vh - ${gutter}px)` : '100vh'
    }, style);
    return (<div className={cn} style={st}>
      {children}
    </div>);
  }

}
