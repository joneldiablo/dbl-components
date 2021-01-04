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

  constructor(props) {
    super(props);
    if (typeof props.onChange === 'function')
      props.onChange({ target: { name: props.name, value: props.value || this.props.options[0].value } });
  }

  onChange = (e) => {
    let validationClassName = !this.ref?.checkValidity() ? 'is-invalid' : '';
    let value= e.target.value;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    this.setState({
      value,
      validationClassName
    });
    if (typeof this.props.onChange === 'function') this.props.onChange({[e.target.name]:value});
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
