import PropTypes from 'prop-types';
import React from "react";
import IcoMoon, { iconList } from "react-icomoon";

let is;

export default class Icons extends React.Component {

  static propTypes = {
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    classes: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    icon: PropTypes.string,
    inline: PropTypes.bool,
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.object,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static jsClass = 'Icons';
  static defaultProps = {
    inline: true,
    className: '',
    icon: null,
    style: {}
  }

  render() {
    let { inline, icon, classes, className, style, width, height, title, size } = this.props;
    // first element empty to generate an space
    let cn = [this.constructor.jsClass, icon];
    if (className) cn.push(className);
    if (classes) cn.push(classes);
    if (inline) {
      cn.push('icon-inline');
    } else {
      style = Object.assign({}, style, { display: 'block' });
    }
    const props = {
      icon,
      iconSet: is,
      className: cn.filter(c => !!c).flat().join(' '),
      style,
      width,
      height,
      title,
      size
    }
    return React.createElement(IcoMoon, { ...props });
  }
}

export const setIconSet = (isIn) => {
  is = isIn;
}

export const addIcons = (newSet) => {
  is.icons.push(...newSet.icons);
}

export const searchIcon = (icon) => {
  let list = iconList(is);
  let final = list.find(iconName =>
    iconName.split(/[, ]+/).find(i => i === icon)
  );
  return final;
}