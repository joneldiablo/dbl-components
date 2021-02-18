import React from "react";

export default class Svg extends React.Component {

  static defaultProps = {
    inline: true,
    className: '',
    src: '',
    style: {}
  }

  render() {
    let { style, src, className, inline, ...props } = this.props;
    // first element empty to generate an space
    const cn = [this.constructor.name, className];
    if (inline) cn.push('icon-inline');
    return (<svg className={cn.join(' ')} style={style} {...props} >
      <use href={href} />
    </svg>);
  }
}
