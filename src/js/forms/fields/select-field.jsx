import React from "react";
import Field from "./field";

export default class SelectField extends Field {

  static jsClass = 'SelectField';

  onChange(e) {
    let { value } = e.target;
    const opt = this.props.options.find(opt => opt.value == value);
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => this.returnData(opt ? opt.value : value, { option: opt }));
  }

  get inputProps() {
    const props = super.inputProps;
    delete props.placeholder;
    delete props.type;
    props.className = props.className.replace('form-control', 'form-select');
    return props;
  }

  get inputNode() {
    const { placeholder, options, label, floating } = this.props;
    const inputNode = (<select {...this.inputProps} >
      {placeholder && (label || !floating) && <option value="" >{placeholder}</option>}
      {placeholder && (label || !floating) && <option disabled>──────────</option>}
      {Array.isArray(options) && options.map(({ disabled, label, value, title }) => {
        let propsOpt = {
          value,
          disabled,
          title
        }
        return <option key={value} {...propsOpt}>{label}</option>
      })}
    </select>);
    return (inputNode);
  }

}
