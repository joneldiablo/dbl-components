import React, { createRef } from "react";
import PropTypes from "prop-types";
import { randomS4 } from "../../functions";
import eventHandler from "../../functions/event-handler";
import Component from "../../component";

export default class Field extends Component {

  static jsClass = 'Field';
  static propTypes = {
    ...Component.propTypes,
    autoComplete: PropTypes.string,
    checkValidity: PropTypes.func,
    controlClasses: PropTypes.string,
    default: PropTypes.any,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    errorMessage: PropTypes.string,
    first: PropTypes.oneOf(['label', 'control']),
    inline: PropTypes.bool,
    inlineLabelClasses: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelClasses: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    noValidate: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      value: PropTypes.any,
      disabled: PropTypes.bool,
      divider: PropTypes.bool
    })),
    pattern: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
    value: PropTypes.any
  }
  static defaultProps = {
    ...Component.defaultProps,
    type: 'text',
    default: '',
    first: 'label'
  }

  unique = randomS4();

  state = {
    value: this.props.value || this.props.default,
    options: this.props.options,
    error: false
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.input = createRef();
  }

  componentDidMount() {
    eventHandler.subscribe('update.' + this.props.name, this.onUpdate, this.unique);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    eventHandler.unsubscribe('update.' + this.props.name, this.unique);
  }

  returnData(value = this.state.value) {
    let { name, id, data } = this.props;
    let { error } = this.state;
    const toDispatch = { [name]: value };
    if (id) toDispatch.id = id;
    if (data) toDispatch.data = data;
    if (!error) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        eventHandler.dispatch(name, toDispatch);
      }, 300);
    }
  }

  isInvalid(value) {
    let { checkValidity, pattern, required } = this.props;
    let inputValid = true;
    this.input.current?.setCustomValidity('');
    if (typeof this.input.current?.checkValidity === 'function') {
      inputValid = this.input.current.checkValidity();
    }
    let valueInvalid = !value;
    if (typeof value === 'boolean' || typeof value === 'number') {
      valueInvalid = false;
    }
    let error = (!inputValid || (required && valueInvalid));
    if (!error && typeof checkValidity === 'function')
      error = !checkValidity(value);
    else if (pattern) error = !(new RegExp(pattern, "i")).test(value);
    if (!required && !value) error = false;
    if (error) {
      this.input.current?.setCustomValidity(this.props.errorMessage);
    }
    return error;
  }

  onInvalid() {
    const { name, required } = this.props;
    const { value } = this.state;
    if (!required && !value) return;
    this.setState(
      { error: true },
      () => eventHandler.dispatch('invalid.' + name, { [name]: value })
    );
  }

  onChange(e) {
    let { value } = e.target;
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => this.returnData());
  }

  onUpdate({ value, options, error, reset }) {
    const newState = {};
    if (typeof value !== 'undefined')
      newState.value = (value !== null ? value : '');
    if (options) newState.options = options;
    if (typeof error === 'boolean') {
      newState.error = error;
      let message = '';
      if (error) message = this.props.errorMessage;
      this.input.current.setCustomValidity(message);
    }
    if (reset) {
      this.setState({ value: this.props.default });
    }
    this.setState(newState);
  }

  get type() {
    return this.props.type;
  }

  get inputProps() {
    const { disabled, readOnly,
      required, name, controlClasses,
      placeholder, step, noValidate,
      min, max, pattern, autoComplete } = this.props;
    const { value, error } = this.state;
    const cn = [
      'form-control',
      controlClasses, error ? 'is-invalid' : ''
    ];
    return {
      id: name,
      name,
      pattern,
      placeholder,
      required,
      autoComplete,
      type: this.type,
      value,
      className: cn.join(' '),
      min, max, step, noValidate,
      disabled,
      readOnly,
      ref: this.input,
      onChange: this.onChange,
      onInvalid: this.onInvalid
    }
  }

  get labelNode() {
    const { placeholder, required, name, labelClasses,
      inline, inlineLabelClasses, label } = this.props;
    const cn = ['form-label', labelClasses];
    if (inline) cn.shift();
    const labelNode = <label className={cn.join(' ')} htmlFor={name}>
      {label ? label : placeholder}
      {required && <b title="Este campo es indispensable" className="text-inherit"> *</b>}
    </label>
    const cnInlineLabelClasses = ['col-auto', inlineLabelClasses];
    return (inline ? <div className={cnInlineLabelClasses.join(' ')}>
      {labelNode}
    </div> : labelNode);
  }

  get inputNode() {
    const { inline } = this.props;
    const inputNode = (<input {...this.inputProps} />);
    return (inline ? <div className="col-auto">
      {inputNode}
    </div> : inputNode);
  }

  get errorMessageNode() {
    const { errorMessage, inline } = this.props;
    const { error } = this.state;
    const errorNode = (<small className="text-danger">
      {errorMessage}
    </small>);
    return (error && errorMessage && (inline ?
      <div className="col-auto">{errorNode}</div> :
      errorNode));
  }

  content(children = this.props.children) {
    const { inline, first, placeholder, label } = this.props;
    const cn = ['position-relative'];
    if (inline) cn.push('row gx-2 align-items-center');
    if (placeholder && !label) cn.push('form-floating');
    return (<>
      <div className={cn.join(' ')}>
        {(first === 'label' && label) && this.labelNode}
        {this.inputNode}
        {(first !== 'label' || (placeholder && !label)) && this.labelNode}
        {this.errorMessageNode}
      </div>
      {children}
    </>);
  }
};