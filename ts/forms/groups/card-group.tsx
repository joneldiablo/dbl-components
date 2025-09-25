import React from "react";

import Group, { GroupProps } from "./group";
import { addFields } from "../fields";

/**
 * Group variant that renders its contents inside a Bootstrap card body.
 *
 * @example
 * <CardGroup name="card" label="Contact" fields={[{ type: "Field", name: "email" }]} />
 */
export default class CardGroup<P extends GroupProps = GroupProps> extends Group<P> {
  static jsClass = "CardGroup";

  constructor(props: P) {
    super(props);
    this.state.localClasses = "card";
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { label, fields, labelClasses } = this.props;
    return React.createElement(
      "div",
      { className: "card-body" },
      label && React.createElement("label", { className: labelClasses }, label),
      fields && fields.map((field, index) => this.mapFields(field, index)),
      children,
    );
  }
}

addFields({ CardGroup });
