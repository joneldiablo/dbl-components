import React from "react";

import Field from "./field";

/**
 * Hidden HTML input wrapper that keeps the Field lifecycle while avoiding extra
 * markup.
 *
 * @example
 * ```tsx
 * <HiddenField name="sessionToken" default="abc123" />
 * ```
 */
export default class HiddenField extends Field {
  static override jsClass = "HiddenField";

  override get type(): string {
    return "hidden";
  }

  override render(): React.ReactElement | null {
    return this.inputNode as React.ReactElement;
  }
}
