import React from "react";
import IcoMoon, { iconList, IcoMoonProps } from "react-icomoon";
import defaultIcons from "../../src/app-icons-v1.0/selection.json";

interface IconSet {
  icons: any[];
  [key: string]: any;
}

export interface IconsProps {
  className?: string | string[];
  classes?: string | string[];
  height?: number | string;
  icon?: string;
  inline?: boolean;
  id?: string;
  size?: number | string;
  style?: React.CSSProperties;
  title?: string;
  width?: number | string;
}

let is: IconSet = JSON.parse(JSON.stringify(defaultIcons));

export default class Icons extends React.Component<IconsProps> {
  static jsClass = "Icons";

  static defaultProps: Partial<IconsProps> = {
    inline: true,
    className: "",
    icon: undefined,
    style: {},
  };

  render(): React.ReactElement {
    let { inline, icon, classes, className, style, width, height, title, size } = this.props;
    icon = searchIcon(icon ?? "") ? icon : "src-error";
    const cn: (string | string[])[] = [Icons.jsClass, icon ?? ""];
    if (className) cn.push(className);
    if (classes) cn.push(classes);
    if (inline) {
      cn.push("icon-inline");
    } else {
      style = Object.assign({}, style, { display: "block" });
    }
    const props: IcoMoonProps & { iconSet: IconSet } = {
      icon: icon ?? "",
      iconSet: is,
      className: cn.filter(Boolean).flat().join(" "),
      style,
      width,
      height,
      title,
      size,
    };
    return React.createElement(IcoMoon, props);
  }
}

export const setIconSet = (isIn: IconSet): void => {
  is = isIn;
};

export const addIcons = (newSet: IconSet): void => {
  is.icons.push(...newSet.icons);
};

export const searchIcon = (icon?: string): string | undefined => {
  if (!icon) return undefined;
  const list = iconList(is);
  return list.find((iconName) =>
    iconName.split(/[, ]+/).some((i) => i === icon)
  );
};
