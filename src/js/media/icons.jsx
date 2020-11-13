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
    let { inline, icon, ...props } = this.props;
    // first element empty to generate an space
    let className = [, this.constructor.name];
    if (inline) className.push('icon-inline');
    props.className += className.join(' ');
    return (<IcoMoon {...props} icon={icon} iconSet={is} />);
  }
}

export const iconSet = (isIn) => {
  is = isIn;
}