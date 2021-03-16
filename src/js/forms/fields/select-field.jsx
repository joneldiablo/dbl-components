import React from "react";
import Field from "./field";

export default class SelectField extends Field {

  static propTypes = {
    ...Field.propTypes
  }

  static defaultProps = {
    ...Field.defaultProps,
    type: 'select'
  };

  constructor(props) {
    super(props);
    this.state.value = props.value;
  }

  get inputNode() {
    const { inline, placeholder, options } = this.props;
    const inputNode = (<select {...this.inputProps} >
      {placeholder && <option value="" disabled >{placeholder}</option>}
      {Array.isArray(options) && options.map(({ disabled, label, value }) => {
        let propsOpt = {
          value,
          disabled
        }
        return <option key={value} {...propsOpt}>{label}</option>
      })}
    </select>);
    return (inline ? <div className="col-auto">
      {inputNode}
    </div> : inputNode);
  }
}
