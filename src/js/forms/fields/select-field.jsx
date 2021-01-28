import React from "react";
import Field from "./field";

export default class SelectField extends Field {

  static propTypes = Object.assign({},Field.propTypes);
  static defaultProps = {
    type: 'select'
  };

  state = {
    value: this.props.value
  };

  constructor(props) {
    super(props);
    if (typeof props.onChange === 'function')
      props.onChange({ [props.name]: props.value });
  }

  onChange = (e) => {
    let validationClassName = !this.ref?.checkValidity() ? 'is-invalid' : '';
    let value = e.target.value;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    this.setState({
      value,
      validationClassName
    });
    if (typeof this.props.onChange === 'function')
      this.props.onChange({ [e.target.name]: value });
  }

  // Renders
  render() {
    let { disabled,
      required, name, options,
      placeholder, label, errorMessage } = this.props;
    let { value, validationClassName } = this.state;
    let inputProps = {
      disabled,
      id: name,
      name,
      placeholder,
      required,
      value,
      onChange: this.onChange,
      className: ['form-select', validationClassName].join(' '),
      ref: r => this.ref = r
    }
    return placeholder && !label ?
      <div class="form-floating">
        <select {...inputProps} >
          {Array.isArray(options) && options.map(({ disabled, label, value: val }) => {
            let propsOpt = {
              value: val,
              disabled
            }
            return <option key={val} {...propsOpt}>{label}</option>
          })}
        </select>
        <small className="invalid-feedback">
          {errorMessage}
        </small>
        <label htmlFor={name}>{placeholder}</label>
      </div> :
      <>
        {label && <label className="form-label" htmlFor={name}>
          {label}
          {required && <small title="Este campo es indispensable" className="text-muted">*</small>}
        </label>}
        <select {...inputProps} >
          {placeholder && <option value="" disabled >{placeholder}</option>}
          {Array.isArray(options) && options.map(({ disabled, label, value: val }) => {
            let propsOpt = {
              value: val,
              disabled
            }
            return <option key={val} {...propsOpt}>{label}</option>
          })}
        </select>
        <small className="invalid-feedback">
          {errorMessage}
        </small>
      </>
  }
}
