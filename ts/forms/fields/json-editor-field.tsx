import React from "react";

import Field, { type FieldProps } from "./field";

export interface JsonEditorFieldProps extends FieldProps {}

/**
 * Placeholder wrapper intended to host a JSON editor widget. The original JavaScript
 * implementation never completed the integration and renders a stub message instead.
 * This port keeps the behaviour intact while preserving the {@link Field} lifecycle.
 */
export default class JsonEditorField extends Field<JsonEditorFieldProps> {
  static override jsClass = "JsonEditorField";

  override get inputProps(): Record<string, any> {
    const { controlClasses, name } = this.props;
    const { value, error } = this.state;
    const className = [
      "svelte-jsoneditor",
      controlClasses,
      error ? "is-invalid" : null,
    ]
      .flat()
      .filter(Boolean)
      .join(" ");

    return {
      id: name,
      name,
      value,
      className,
      ref: this.input,
    };
  }

  override get inputNode(): React.ReactNode {
    return React.createElement("div", {}, "SIN TERMINAR XP");
  }
}
