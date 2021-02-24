import React from "react";
import Field from "./field";

export default class HiddenField extends Field {

  static defaultProps = {
    name: null,
    value: null
  }

  get type() {
    return 'hidden';
  }

  // Renders
  render() {
    return this.inputNode;
  }

}
