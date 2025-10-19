import React from "react";

import Field, { type FieldProps } from "./field";

export interface GroupFieldProps extends FieldProps {
  groupClasses?: string | string[];
  children?: React.ReactNode;
}

export default class GroupField extends Field<GroupFieldProps> {
  declare props: GroupFieldProps;

  static override jsClass = "GroupField";

  override get inputNode(): React.ReactNode {
    const { children, groupClasses } = this.props;
    const start: React.ReactNode[] = [];
    const end: React.ReactNode[] = [];

    React.Children.toArray(children).forEach((child) => {
      if (!React.isValidElement(child)) return;
      const effective =
        child.type === "section" && React.isValidElement(child.props.children)
          ? (child.props.children as React.ReactElement)
          : child;
      const position = (effective.props as any)?.position;
      if (position === "start") start.push(child);
      else if (position === "end") end.push(child);
    });

    const className = ["input-group", groupClasses].flat().filter(Boolean).join(" ");
    return React.createElement(
      "div",
      { className },
      start,
      React.createElement("input", { ...this.inputProps }),
      end
    );
  }

  override content(): React.ReactNode {
    return super.content(null);
  }
}
