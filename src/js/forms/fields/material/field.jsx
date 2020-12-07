import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Info from "./info";

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
    style: null,
    info: '',
    style: { fontSize: 12 },
    variant: 'outlined',
    validation: null,
    fullWidth: true
  }

  state = {
    value: this.props.value,
    errorMessage: null,
    error: false
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    let { validation, pattern, onChange, required, errorMessage } = this.props;
    let error = (required && !e.target.value);
    if (typeof validation === 'function') error = validation(e.target.value);
    else if (pattern) error = pattern.test(e.target.value);

    this.setState({
      value: e.target.value,
      error,
      errorMessage: (error ? errorMessage : null)
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
  nodeInfo(info) {
    return <InputAdornment position="start">
      <Info message={info} />
    </InputAdornment>
  }

  render() {
    let { type, disabled, info,
      required, name, variant, fullWidth,
      placeholder, label } = this.props;
    let { value, error, errorMessage } = this.state;
    let inputProps = {
      label,
      name,
      id: name,
      type: this.processType(type),
      placeholder,
      required,
      disabled,
      value,
      onChange: this.onChange,
      error,
      helperText: errorMessage,
      InputProps: { startAdornment: this.nodeInfo(info) },
      autoComplete: 'off',
      variant,
      fullWidth,
      ref: r => this.ref = r
    }
    return (<>
      <TextField {...inputProps} />
      <br />
      <br />
    </>);
  }

}
