import React from "react";
import IcoMoon, { iconList } from "react-icomoon";

let is;

export default class Icons extends React.Component {

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
    let { inline, icon, active, classes, style, className } = this.props;
    // first element empty to generate an space
    let cn = [className, classes, this.constructor.name];
    if (inline) cn.push('icon-inline');
    return (<IcoMoon icon={icon} iconSet={is} className={cn.join(' ')} style={style} />);
  }
}

export const iconSet = (isIn) => {
  is = isIn;
}