import React from "react";
import PropTypes from "prop-types";

export default class Field extends React.Component {

  static propTypes = {
    value: PropTypes.any,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    errorMessage: PropTypes.string,//considerar un {} para tener multiples o string
    options: PropTypes.array, //{ label: string, value: any }[],
    onChange: PropTypes.func
  }

  static defaultProps = {
    type: 'text'
  }

  state = {
    value: this.props.value || ''
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    if (typeof props.onChange === 'function')
      props.onChange({ [props.name]: props.value });
  }

  onChange(e) {
    let { onChange } = this.props;
    let validationClassName = !this.ref?.checkValidity() ? 'is-invalid' : '';
    this.setState({
      value: e.target.value,
      validationClassName
    });
    if (typeof onChange === 'function') {
      onChange({ [e.target.name]: e.target.value });
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
