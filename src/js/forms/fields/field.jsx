import React from "react";
import GroupField from "../groups/group";
import HiddenField from "./hidden-field";
import SelectField from "./select-field";

const fieldComponents = {
  'group': GroupField,
  'hidden': HiddenField,
  'select': SelectField
}

export const setFieldComponents = (fc) => {
  Object.keys(fc).forEach(i => {
    fieldComponents[i] = fc[i];
  });
}

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

  FieldComponent = fieldComponents[this.props.type];

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
  field(props) {
    let { type, disabled,
      required, pattern, name,
      placeholder, label, errorMessage } = props;
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

  render() {
    let { className, style, ...props } = this.props;
    let cn = [this.constructor.name, className].join(' ');
    return <div className={cn} style={style}>
      {this.FieldComponent ?
        <this.FieldComponent {...props} /> :
        this.field(props)
      }
    </div>
  }
}
