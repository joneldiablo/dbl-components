import React, { createRef } from "react";
import PropTypes from "prop-types";
import Component from "../../component";
import { hash } from "../../functions";

//TODO: cambiar a "descontrolado" (hahaha)
// usar defaultValue en lugar de value en el input
// implica cambiar todos los fields
// modificar Form tambien para que el default se cargue al data
// pero "value" no.

export default class Field extends Component {

  static propTypes = {
    ...Component.propTypes,
    labelClasses: PropTypes.string,
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
    default: '',
    first: 'label'
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
    if (props.options) this.hashOpts = hash(JSON.stringify(props.options));
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
    if (this.props.options) {
      const hashOpts = hash(JSON.stringify(this.props.options));
      if (this.hashOpts != hashOpts) {
        this.hashOpts = hashOpts;
        this.setState({ options: this.props.options });
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

  get type() {
    return this.props.type;
  }

  get inputProps() {
    const { disabled,
      required, name, fieldClasses,
      placeholder, step, noValidate,
      min, max, pattern, autoComplete } = this.props;
    const { value, error } = this.state;
    const cn = ['form-control', fieldClasses, error ? 'is-invalid' : ''];
    return {
      disabled,
      id: name,
      name,
      pattern,
      placeholder,
      required,
      autoComplete,
      type: this.type,
      value,
      onChange: this.onChange,
      onInvalid: this.onInvalid,
      className: cn.join(' '),
      min, max, step, noValidate,
      ref: r => this.input = r
    }
  }

  get labelNode() {
    const { label, placeholder, required, name, labelClasses, inline } = this.props;
    const cn = ['form-label', labelClasses];
    if (inline) cn.push('my-2');
    const labelNode = <label className={cn.join(' ')} htmlFor={name}>
      {label ? label : placeholder}
      {required && <b title="Este campo es indispensable" className="text-inherit"> *</b>}
    </label>
    return (inline ? <div className="col-auto">
      {labelNode}
    </div> : labelNode);
  }

  get inputNode() {
    const { inline } = this.props;
    const inputNode = (<input {...this.inputProps} />);
    return (inline ? <div className="col-auto">
      {inputNode}
      {this.errorMessageNode}
    </div> : inputNode);
  }

  get errorMessageNode() {
    const { errorMessage } = this.props;
    const { error } = this.state;
    return (error && errorMessage && <small className="text-danger">
      {errorMessage}
    </small>);
  }

  content(children = this.props.children) {
    const { inline, first, placeholder, label } = this.props;
    const cn = ['position-relative'];
    if (inline) cn.push('row gx-2');
    if (placeholder && !label) cn.push('form-floating');
    return (<>
      <div className={cn.join(' ')}>
        {(first === 'label' && label) && this.labelNode}
        {this.inputNode}
        {(first !== 'label' || (placeholder && !label)) && this.labelNode}
        {!inline && this.errorMessageNode}
      </div>
      {children}
    </>);
  }
};