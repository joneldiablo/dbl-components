import React from "react";
import Field from "./field";

export default class TextareaField extends Field {

  static jsClass = 'TextareaField';

  get inputProps() {
    const props = super.inputProps;
    props.cols = this.props.cols;
    props.rows = this.props.rows;
    return props;
  }

  get inputNode() {
    const { inline } = this.props;
    const inputNode = (<textarea {...this.inputProps} />);
    return (inline ? <div className="col-auto">
      {inputNode}
    </div> : inputNode);
  }

}
