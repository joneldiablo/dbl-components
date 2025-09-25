import React from "react";

import Container, { ContainerProps } from "./container";

export interface ListContainerProps extends ContainerProps {
  liClasses?: string | string[];
}

export default class ListContainer extends Container {
  static jsClass = "ListContainer";
  static defaultProps: Partial<ListContainerProps> = {
    ...Container.defaultProps,
    liClasses: [],
    fullWidth: true,
    tag: "ul",
  };

  declare props: ListContainerProps;

  li(
    children: React.ReactNode = this.props.children,
    extraClasses?: string | string[]
  ): React.ReactNode[] {
    const { liClasses } = this.props;
    return Array.isArray(children)
      ? (children
          .map((child, i) => {
            if (!child) return null;
            const licn = [i % 2 ? "even" : "odd", "li-num-" + i];
            const childElement = child as React.ReactElement<any>;
            const theChildConf = (
              !(childElement.props?.style &&
              childElement.props.style["--component-name"])
                ? childElement
                : childElement.props.children
            ).props || {};
            const childLiClasses = theChildConf?.liClasses;
            if (childLiClasses) licn.push(childLiClasses);
            // merge general classes: if a string, apply to every item
            // if an array, apply by index and repeat the last class when counts differ
            if (typeof liClasses === "string") licn.push(liClasses);
            else if (Array.isArray(liClasses) && liClasses[i])
              licn.push(liClasses[i]);
            else if (Array.isArray(liClasses) && liClasses.length > 0)
              licn.push(liClasses[liClasses.length - 1]);

            if (typeof extraClasses === "string") licn.push(extraClasses);
            else if (Array.isArray(extraClasses) && extraClasses[i])
              licn.push(extraClasses[i]);
            else if (Array.isArray(extraClasses) && extraClasses.length > 0)
              licn.push(extraClasses[extraClasses.length - 1]);

            return React.createElement(
              "li",
              { className: licn.flat().join(" "), key: i },
              child
            );
          })
          .filter(Boolean) as React.ReactNode[])
      : [];
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return this.breakpoint ? this.li(children) : this.waitBreakpoint;
  }
}

