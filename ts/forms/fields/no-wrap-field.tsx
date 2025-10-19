import React from "react";

import Field from "./field";

export default class NoWrapField extends Field {
  static override jsClass = "NoWrapField";

  ContentWrap = React.Fragment;

  render(): React.ReactNode {
    return this.content();
  }
}
