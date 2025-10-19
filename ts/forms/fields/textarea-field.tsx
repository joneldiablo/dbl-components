import React from "react";

import Field, { type FieldProps } from "./field";

/**
 * Props accepted by {@link TextareaField}.
 *
 * @example
 * ```tsx
 * <TextareaField name="bio" label="Biography" rows={4} />
 * ```
 */
export interface TextareaFieldProps extends FieldProps {
  cols?: number;
  rows?: number;
}

/**
 * Field rendering a multi-line `<textarea>` element with the standard Field
 * conveniences.
 *
 * @example
 * ```tsx
 * <TextareaField name="notes" label="Notes" cols={40} rows={5} />
 * ```
 */
export default class TextareaField extends Field<TextareaFieldProps> {
  declare props: TextareaFieldProps;

  static override jsClass = "TextareaField";

  override get inputProps(): Record<string, any> {
    const props = { ...super.inputProps };
    if (this.props.cols) props.cols = this.props.cols;
    if (this.props.rows) props.rows = this.props.rows;
    return props;
  }

  override get inputNode(): React.ReactNode {
    const { inline } = this.props;
    const inputNode = React.createElement("textarea", { ...this.inputProps });
    return inline
      ? React.createElement("div", { className: "col-auto" }, inputNode)
      : inputNode;
  }
}
