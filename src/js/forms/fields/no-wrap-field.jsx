import React from "react";

import Field from "./field";

export default class NoWrapField extends Field {

  static jsClass = 'NoWrapField';

  ContentWrap = React.Fragment;

  render() {
    return this.content();
  }
};