import React from "react";

import Field from "./field";

/**
 * Variant of {@link Field} that renders its content without the wrapping container.
 *
 * @example
 * ```tsx
 * <NoWrapField name="code" label="Inline code" />
 * ```
 */
export default class NoWrapField extends Field {
  static override jsClass = "NoWrapField";

  ContentWrap = React.Fragment;

  render(): React.ReactElement | null {
    return this.content() as React.ReactElement;
  }
}
