import React from "react";

export default class Svg extends React.Component {

  static jsClass = 'Svg';
  static defaultProps = {
    inline: true,
    className: '',
    href: '',
    style: {}
  }

  render() {
    let { style, href, className, inline, ...props } = this.props;
    // first element empty to generate an space
    const cn = [this.constructor.jsClass, className];
    if (inline) cn.push('icon-inline');
    return (<svg className={cn.join(' ')} style={style} {...props} >
      <use href={href} />
    </svg>);
  }
}
