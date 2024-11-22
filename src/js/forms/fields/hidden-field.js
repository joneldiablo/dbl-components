import React from "react";

import Field from "./field";

export default class HiddenField extends Field {

  static propTypes = {
    ...Field.propTypes
  }

  static jsClass = 'HiddenField';

  get type() {
    return 'hidden';
  }

  // Renders
  render() {
    return this.inputNode;
  }

}
