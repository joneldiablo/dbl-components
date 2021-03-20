import React from "react";
import Field from "./field";

export default class HiddenField extends Field {

  get type() {
    return 'hidden';
  }

  // Renders
  render() {
    return this.inputNode;
  }

}
