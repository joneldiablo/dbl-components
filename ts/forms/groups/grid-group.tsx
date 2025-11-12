import React from "react";

import Group, { GroupProps } from "./group";
import { addFields } from "../fields";
import type { FieldDefinition } from "../types";

/**
 * Props accepted by the {@link GridGroup} wrapper.
 *
 * @example
 * const props: GridGroupProps = { name: "grid", colClasses: "col-lg-4" };
 */
export interface GridGroupProps extends GroupProps {
  colClasses?: string | string[];
  rowClasses?: string | string[];
}

/**
 * Responsive grid wrapper capable of arranging nested fields by columns.
 *
 * @example
 * <GridGroup name="grid" fields={[{ type: "Field", name: "email" }]} colClasses="col-sm-6" />
 */
export default class GridGroup<P extends GridGroupProps = GridGroupProps> extends Group<P> {
  static jsClass = "GridGroup";

  columnClasses(colClasses: GridGroupProps["colClasses"], i: number): string {
    const classes = ["col-md", i % 2 ? "even" : "odd", `col-num-${i}`];
    if (typeof colClasses === "string") classes.push(colClasses);
    else if (Array.isArray(colClasses) && colClasses[i]) classes.push(colClasses[i]);
    else if (Array.isArray(colClasses) && colClasses.length > 0) classes.push(colClasses[colClasses.length - 1]);
    return classes.flat().filter(Boolean).join(" ");
  }

  mapFields(field: FieldDefinition, i: number): React.ReactNode {
    const { colClasses } = this.props;
    const wrapperClasses = [
      "col",
      this.columnClasses(colClasses, i),
      field.colClasses,
    ];
    return React.createElement(
      "div",
      { key: i, className: wrapperClasses.flat().filter(Boolean).join(" ") },
      super.mapFields(field, i),
    );
  }

  mapChildren = (
    fieldNode: React.ReactElement<{ colClasses?: string | string[] }>,
    i: number,
  ): React.ReactNode => {
    const { colClasses } = this.props;
    const wrapperClasses = [
      "col",
      this.columnClasses(colClasses, i),
      fieldNode.props.colClasses,
    ];
    return React.createElement(
      "div",
      { key: i, className: wrapperClasses.flat().filter(Boolean).join(" ") },
      fieldNode,
    );
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { label, fields, labelClasses, rowClasses } = this.props;
    const rowClassName = ["row", rowClasses].flat().filter(Boolean).join(" ");
    return React.createElement(
      React.Fragment,
      {},
      label && React.createElement("label", { className: labelClasses }, label),
      React.createElement(
        "div",
        { className: rowClassName },
        fields && fields.map((field, index) => this.mapFields(field, index)),
        Array.isArray(children) ? children.map(this.mapChildren) : children,
      ),
    );
  }
}

addFields({ GridGroup });
