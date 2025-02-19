import React from "react";

import Field from "./field";

export default class NoWrapField extends Field {

  static propTypes = {
    ...Field.propTypes
  }

  static jsClass = 'NoWrapField';

  ContentWrap = React.Fragment;

  render() {
    return this.content();
  }
};