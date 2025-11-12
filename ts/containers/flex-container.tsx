import React from "react";

import Component, { ComponentProps } from "../component";

export interface FlexContainerProps extends ComponentProps {
  colClassNames?: string | string[];
}

export default class FlexContainer extends Component<FlexContainerProps> {
  static jsClass = "FlexContainer";
  static defaultProps: Partial<FlexContainerProps> = {
    ...Component.defaultProps,
    colClassNames: [],
  };

  classes = "d-flex";

  column(child: React.ReactNode, i: number): React.ReactElement {
    const { colClassNames } = this.props;
    const colcn: string[] = [];
    if (typeof colClassNames === "string") colcn.push(colClassNames);
    else if (Array.isArray(colClassNames) && colClassNames[i])
      colcn.push(colClassNames[i]);
    else if (Array.isArray(colClassNames) && colClassNames.length > 0)
      colcn.push(colClassNames[colClassNames.length - 1]);

    return React.createElement(
      "div",
      { className: colcn.flat().join(" "), key: i },
      child
    );
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return Array.isArray(children)
      ? children.map((child, i) => this.column(child, i))
      : children;
  }
}

