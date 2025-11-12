import React from "react";

import Container, { ContainerProps } from "./container";

export interface GridContainerProps extends ContainerProps {
  colClasses?: string | string[];
  colTag?: React.ElementType;
  row?: string;
}
export default class GridContainer extends Container {
  static jsClass = "GridContainer";
  static defaultProps: Partial<GridContainerProps> = {
    ...Container.defaultProps,
    colClasses: [],
    colTag: "div",
    fullWidth: true,
    row: "height-auto",
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  };

  declare props: GridContainerProps;

  constructor(props: GridContainerProps) {
    super(props);
    this.classes = ["row", props.row].filter(Boolean).join(" ");
  }

  grid(
    children: React.ReactNode = this.props.children,
    extraClasses?: string | string[]
  ): React.ReactNode[] {
    const { colClasses, colTag } = this.props;
    return Array.isArray(children)
      ? (children
          .map((child, i) => {
            if (!child) return null;
            const colcn = [
              "col-md",
              i % 2 ? "even" : "odd",
              "col-num-" + i,
            ];
            const childElement = child as React.ReactElement<any>;
            const childConf = (
              !(childElement.props?.style &&
              childElement.props.style["--component-name"])
                ? childElement
                : childElement.props.children
            ).props || {};
            const childColClasses = childConf.colClasses;
            if (childColClasses) colcn.push(childColClasses);
            // merge general classes: if a string, apply to every column
            // if an array, apply by index and repeat the last class when counts differ
            else if (typeof colClasses === "string") colcn.push(colClasses);
            else if (Array.isArray(colClasses) && colClasses[i])
              colcn.push(colClasses[i]);
            else if (Array.isArray(colClasses) && colClasses.length > 0)
              colcn.push(colClasses[colClasses.length - 1]);

            if (typeof extraClasses === "string") colcn.push(extraClasses);
            else if (Array.isArray(extraClasses) && extraClasses[i])
              colcn.push(extraClasses[i]);
            else if (Array.isArray(extraClasses) && extraClasses.length > 0)
              colcn.push(extraClasses[extraClasses.length - 1]);

            const ColTag: React.ElementType = childConf.colTag || colTag || "div";
            return React.createElement(
              ColTag,
              { className: colcn.flat().join(" "), key: i },
              child
            );
          })
          .filter(Boolean) as React.ReactNode[])
      : [];
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return this.breakpoint ? this.grid(children) : this.waitBreakpoint;
  }
}

