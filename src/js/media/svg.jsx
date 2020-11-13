import React from "react";

export default class Svg extends React.Component {

  static defaultProps = {
    inline: true,
    className: '',
    href: '',
    style: {}
  }

  render() {
    let { style, href, className, inline, ...props } = this.props;
    // first element empty to generate an space
    className = [this.constructor.name, className];
    if (inline) className.push('icon-inline');
    return (<svg className={className.join(' ')} style={style} {...props} >
      <use href={href} />
    </svg>);
  }
}