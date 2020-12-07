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
    onChange: null
  }

  state = {
    value: this.props.value
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    let { onChange } = this.props;
    let validationClassName = !this.ref?.checkValidity() ? 'is-invalid' : '';
    this.setState({
      value: e.target.value,
      validationClassName
    });
    if (typeof onChange === 'function') {
      onChange = onChange.bind(this);
      onChange(e);
    }
  }

  processType(type) {
    return type;
  }

  // Renders
  render() {
    let { type, disabled,
      required, pattern, name,
      placeholder, label, errorMessage, min, max } = this.props;
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
      min, max,
      ref: r => this.ref = r
    }
    return <>
      {placeholder && !label ?
        <div className="form-floating">
          <input {...inputProps} />
          <label htmlFor={name}>{placeholder}</label>
        </div> :
        <><label className="form-label" htmlFor={name}>
          {label}
          {required && <small title="Este campo es indispensable" className="text-muted">*</small>}
        </label>
          <input {...inputProps} />
        </>}
      <small className="invalid-feedback">
        {errorMessage}
      </small>
    </>
  }
}
