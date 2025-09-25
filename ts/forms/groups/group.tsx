import React from "react";

import Component, { ComponentProps } from "../../component";
import fieldComponents, { addFields } from "../fields";
import type { FieldDefinition } from "../types";

/**
 * Props accepted by the {@link Group} container.
 *
 * @example
 * const props: GroupProps = { name: "details", label: "Details" };
 */
export interface GroupProps extends ComponentProps {
  label?: React.ReactNode;
  labelClasses?: string | string[];
  fieldClasses?: string | string[];
  fields?: FieldDefinition[];
}

/**
 * Field container capable of rendering nested field definitions while keeping Bootstrap styling.
 *
 * @example
 * <Group name="profile" fields={[{ type: "Field", name: "email" }]} />
 */
export default class Group<P extends GroupProps = GroupProps> extends Component<P> {
  static jsClass = "Group";
  static defaultProps: Partial<GroupProps> = {
    ...Component.defaultProps,
    fieldClasses: "mb-3",
    fields: [],
  };

  constructor(props: P) {
    super(props);
    this.mapFields = this.mapFields.bind(this);
  }

  mapFields(field: FieldDefinition, i: number): React.ReactNode {
    const { fieldClasses } = this.props;
    const keyName = `${i}-${field.name ?? i}`;
    const isGroup = field.type?.toLowerCase().includes("group");
    const fallbackKey = isGroup ? "Group" : "Field";
    const FieldComponent =
      (field.type && fieldComponents[field.type]) ||
      fieldComponents[fallbackKey] ||
      fieldComponents.Field;
    const classes = [field.classes, fieldClasses].flat().filter(Boolean).join(" ");
    const { fields: childFields, ...rest } = field;
    const fieldProps: Record<string, any> = {
      key: keyName,
      ...rest,
      classes,
    };
    if (childFields) {
      fieldProps.children = childFields.map((child, index) => this.mapFields(child, index));
    }
    return React.createElement(FieldComponent, fieldProps);
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { label, fields, labelClasses } = this.props;
    return React.createElement(
      React.Fragment,
      {},
      label && React.createElement("label", { className: labelClasses }, label),
      fields && fields.map((field, index) => this.mapFields(field, index)),
      children,
    );
  }
}

addFields({ Group });
