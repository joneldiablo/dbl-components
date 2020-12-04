import React from "react";

export default class Field extends React.Component {

  static defaultProps = {
    value: '',
    type: 'text',
    disabled: false,
    required: false,
    pattern: null,
    name: null,
    label: null,
    placeholder: null,
    errorMessage: null,//considerar un {} para tener multiples o string
    options: null, //{ label: string, value: any }[],
    fields: null,//if type===Group|FormGroup this fields are set
    onChange: null,
    className: null,
    style: null
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

  processType(type) {
    return type;
  }

  // Renders
  render() {
    let { type, disabled,
      required, pattern, name,
      placeholder, label, errorMessage } = this.props;
    let { value, validationClassName } = this.state;
    let inputProps = {
      disabled,
      id: name,
      name,
      pattern,
      placeholder,
      required,
      type: this.processType(type),
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
      <input {...inputProps} />
      <small className="invalid-feedback">
        {errorMessage}
      </small>
    </>
  }
}
