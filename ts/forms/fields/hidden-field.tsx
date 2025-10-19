import React from "react";

import Field from "./field";

export default class HiddenField extends Field {
  static override jsClass = "HiddenField";

  override get type(): string {
    return "hidden";
  }

  override render(): React.ReactNode {
    return this.inputNode;
  }
}
