import React from "react";
import IcoMoon, { iconList } from "react-icomoon";

let is;

export default class Icons extends React.Component {

  static jsClass = 'Icons';
  static defaultProps = {
    inline: true,
    className: '',
    icon: null,
    style: {}
  }

  searchIcon(icon) {
    let list = iconList(is);
    let final = list.find(iconName =>
      iconName.split(/[, ]+/).find(i => i === icon)
    );
    return final;
  }

  render() {
    let { inline, icon, classes, className, style, width, height } = this.props;
    // first element empty to generate an space
    let cn = [className, classes, this.constructor.jsClass];
    if (inline) cn.push('icon-inline');
    const props = {
      icon,
      iconSet: is,
      className: cn.join(' '),
      style,
      width,
      height
    }
    return (<IcoMoon {...props} />);
  }
}

export const iconSet = (isIn) => {
  is = isIn;
}