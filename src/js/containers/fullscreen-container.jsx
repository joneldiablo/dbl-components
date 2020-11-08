import React from 'react';

export default class FullscreenContainer extends React.Component {

  static defaultProps = {
    className: '',
    overflow: 'hidden',
    gutter: 0
  }

  render() {
    let className = [this.constructor.name, this.props.className].join(' ');
    let style = {
      overflow: this.props.overflow,
      height: `calc(100vh - ${this.props.gutter}px)`
    };
    return (
      <div className={className} style={style}>
        {this.props.children}
      </div>
    );
  }

}
