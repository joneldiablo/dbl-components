import React, { createRef } from "react";
import PropTypes from "prop-types";
import Component from "../../component";

export default class Field extends Component {

  static propTypes = {
    ...Component.propTypes,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    default: PropTypes.any,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    errorMessage: PropTypes.string,//considerar un {} para tener multiples o string
    options: PropTypes.array, //{ label: string, value: any }[],
    onChange: PropTypes.func,
    //onInvalid: PropTypes.func
  }

  static defaultProps = {
    ...Component.defaultProps,
    type: 'text',
    default: ''
  }

  state = {
    value: this.props.value || this.props.default,
    error: false
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.input = createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    // TODO: fix this s....
    if (typeof prevProps.value === 'undefined' && typeof this.props.value !== 'undefined') {
      if (!Array.isArray(this.props.value)) {
        if (this.props.value !== this.state.value) {
          this.setState({ value: this.props.value });
        }
      }
    }
  }

  returnData(value = this.state.value) {
    let { onChange, name } = this.props;
    let { error } = this.state;
    if (typeof onChange === 'function' && !error) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        onChange({ [name]: value });
      }, 300);
    }
  }

  isInvalid(value) {
    let { isInvalid, pattern, required } = this.props;
    let inputValid = true;
    if (typeof this.input.checkValidity === 'function') {
      inputValid = this.input.checkValidity();
    }
    let valueInvalid = !value;
    if (typeof value === 'boolean' || typeof value === 'number') {
      valueInvalid = false;
    }
    let error = (!inputValid || (required && valueInvalid));
    if (!error && typeof isInvalid === 'function')
      error = isInvalid(value);
    else if (pattern) error = !(new RegExp(pattern, "i")).test(value);
    return error;
  }

  onInvalid(e) {
    this.setState({
      error: true
    });
  }

  onChange(e) {
    let { value } = e.target;
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => this.returnData());
  }

  processType(type) {
    return type;
  }

  get inputProps() {
    const { type, disabled,
      required, name,
      placeholder,
      min, max, pattern, autocomplete } = this.props;
    const { value, error } = this.state;
    const cn = ['form-control', error ? 'is-invalid' : ''];
    return {
      disabled,
      id: name,
      name,
      pattern,
      placeholder,
      required,
      autoComplete: autocomplete ? 'off' : null,
      type: this.processType(type),
      value,
      onChange: this.onChange,
      onInvalid: this.onInvalid,
      className: cn.join(' '),
      min, max,
      ref: r => this.input = r
    }
  }

  get nodeLabel() {
    const { label, placeholder, required, name } = this.props
    return <label className="form-label" htmlFor={name}>
      {label ? label : placeholder}
      {required && <small title="Este campo es indispensable" className="text-muted">*</small>}
    </label>
  }

  outline() {
    const { errorMessage } = this.props;
    return <div className="form-floating">
      <input {...this.inputProps} />
      {this.nodeLabel}
      <small className="invalid-feedback">
        {errorMessage}
      </small>
    </div>
  }

  labeled() {
    const { errorMessage } = this.props;
    return <div>
      {this.nodeLabel}
      <input {...this.inputProps} />
      <small className="invalid-feedback">
        {errorMessage}
      </small>
    </div>
  }

  content(children = this.props.children) {
    let { placeholder, label } = this.props;
    return <>
      {placeholder && !label ?
        this.outline() : this.labeled()}
      {children}
    </>;
  }
};