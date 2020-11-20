import React from "react";

export default class SelectField extends React.Component {

  static defaultProps = {
    value: '',
    disabled: false,
    required: false,
    name: null,
    label: null,
    placeholder: null,
    errorMessage: null,//considerar un {} para tener multiples o string
    options: [], //{ label: string, value: any, disabled:boolean }[],
    onChange: null
  }

  state = {
    value: this.props.value
  }

  onChange = (e) => {
    let validationClassName = !this.ref?.checkValidity() ? 'is-invalid' : '';
    this.setState({
      value: e.target.value,
      validationClassName
    });
    if (typeof this.props.onChange === 'function') this.props.onChange(e);
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
      className: ['form-control', validationClassName].join(' '),
      ref: r => this.ref = r
    }
    return <>
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
