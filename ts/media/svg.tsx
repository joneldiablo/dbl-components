import React from "react";

export interface SvgProps
  extends Omit<React.SVGProps<SVGSVGElement>, "className"> {
  className?: string | string[];
  classes?: string | string[];
  href?: string;
  inline?: boolean;
}

export default class Svg extends React.Component<SvgProps> {
  static jsClass = "Svg";
  static defaultProps: Partial<SvgProps> = {
    className: "",
    classes: "",
    href: "",
    inline: true,
    style: {},
  };

  render(): React.ReactElement {
    let { style, href, className, classes, inline, ...props } = this.props;
    const cn: (string | string[])[] = [Svg.jsClass];
    if (className) cn.push(className);
    if (classes) cn.push(classes);
    if (inline) cn.push("icon-inline");
    return React.createElement(
      "svg",
      { className: cn.filter(Boolean).flat().join(" "), style, ...props },
      React.createElement("use", { href })
    );
  }
}
