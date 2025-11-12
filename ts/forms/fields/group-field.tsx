import React from "react";

import Field, { type FieldProps } from "./field";

/**
 * Props accepted by {@link GroupField}.
 *
 * @example
 * ```tsx
 * <GroupField name="price">
 *   <span position="start" className="input-group-text">
 *     $
 *   </span>
 * </GroupField>
 * ```
 */
export interface GroupFieldProps extends FieldProps {
  groupClasses?: string | string[];
  children?: React.ReactNode;
}

/**
 * Wraps the default input node with Bootstrap-like group controls, preserving children
 * placed at the start or end of the group.
 *
 * @example
 * ```tsx
 * <GroupField name="search" label="Search">
 *   <button position="end" type="submit" className="btn btn-outline-secondary">
 *     Go
 *   </button>
 * </GroupField>
 * ```
 */
export default class GroupField extends Field<GroupFieldProps> {
  declare props: GroupFieldProps;

  static override jsClass = "GroupField";

  override get inputNode(): React.ReactNode {
    const { children, groupClasses } = this.props;
    const start: React.ReactNode[] = [];
    const end: React.ReactNode[] = [];

    React.Children.toArray(children).forEach((child) => {
      if (!React.isValidElement(child)) return;
      const element = child as React.ReactElement<{ position?: string; children?: React.ReactNode }>;
      const effective =
        element.type === "section" && React.isValidElement(element.props.children)
          ? (element.props.children as React.ReactElement<{ position?: string }>)
          : element;
      const position = (effective.props as { position?: string } | undefined)?.position;
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
