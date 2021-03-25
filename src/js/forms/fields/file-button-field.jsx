import React, { createRef } from "react";
import DropFileField from "./drop-file-field";

export default class FileButtonField extends DropFileField {

  static defaultProps = {
    ...DropFileField.defaultProps,
    labelClasses: 'mb-0'
  }

  tag = 'span';

  constructor(props) {
    super(props);
    this.state.localClasses = 'btn position-relative';
  }

  content(children = this.props.children) {
    const { value } = this.state;
    return <>
      {this.labelNode}
      {children && (!value ? children[0] : children[1])}
      {!children && value}
      {this.inputNode}
    </>
  }

  render() {
    return <>
      {super.render()}
      {this.errorMessageNode}
    </>
  }

}