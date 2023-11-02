import React, { Fragment, createRef } from "react";
import PropTypes from "prop-types";
import { randomS4 } from "../../functions";
import eventHandler from "../../functions/event-handler";
import Component from "../../component";

export default class Field extends Component {

  static jsClass = 'Field';
  static propTypes = {
    ...Component.propTypes,
    autoComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    checkValidity: PropTypes.func,
    controlClasses: PropTypes.string,
    default: PropTypes.any,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
    first: PropTypes.oneOf(['label', 'control']),
    inline: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelClasses: PropTypes.string,
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    noValidate: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.bool]),
      value: PropTypes.any,
      disabled: PropTypes.bool,
      divider: PropTypes.bool
    })),
    pattern: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    required: PropTypes.bool,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    accept: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
    floating: PropTypes.bool
  }
  static defaultProps = {
    ...Component.defaultProps,
    type: 'text',
    default: '',
    value: '',
    first: 'label',
    floating: true
  }

  unique = randomS4();

  state = {
    value: this.props.value || this.props.default,
    options: this.props.options,
    error: false
  }
  ContentWrap = 'div';

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.input = createRef();
  }

  componentDidMount() {
    eventHandler.subscribe('update.' + this.props.name, this.onUpdate, this.unique);
    eventHandler.dispatch('ready.' + this.props.name);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    eventHandler.unsubscribe('update.' + this.props.name, this.unique);
  }

  extractString(obj) {
    if (typeof obj === 'string') return obj;
    else if (Array.isArray(obj)) {
      return obj.map(e => this.extractString(e)).join(' ');
    } else if (React.isValidElement(obj)) {
      return this.extractString(obj.props.children);
    } else if (!obj) return '';
    return obj.toString();
  }

  returnData(value = this.state.value, extra) {
    let { name, id, data } = this.props;
    let { error } = this.state;
    const toDispatch = { [name]: value };
    if (id) toDispatch.id = id;
    if (data) toDispatch.data = data;
    if (this._reset) this._reset = false;
    else if (!error) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        eventHandler.dispatch(name, toDispatch, extra);
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
      const errorMessage = this.extractString(this.props.errorMessage);
      this.input.current?.setCustomValidity(errorMessage);
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
    const error = this.isInvalid(value);
    this.setState({
      value,
      error
    }, () => this.returnData());
  }

  onUpdate({ value, options, error, reset }) {
    const newState = {};
    if (typeof value !== 'undefined')
      newState.value = (value !== null ? value : this.props.default);
    if (options) newState.options = options;
    if (typeof error === 'boolean') {
      newState.error = error;
      let message = '';
      if (error) message = this.extractString(this.props.errorMessage);
      this.input.current.setCustomValidity(message);
    }
    if (reset) {
      newState.value = newState.value || this.props.default;
      this._reset = true;
      return this.setState(newState, this.returnData);
    }
    this.setState(newState, () => {
      if (this.input.current && typeof value !== 'undefined') {
        setTimeout(() => {
          const error = this.isInvalid(value);
          if (this.state.error !== error) this.setState({ error });
        }, 300);
      }
    });
  }

  onFocus = () => {
    const { name } = this.props;
    eventHandler.dispatch('focus.' + name);
  }

  get type() {
    return this.props.type;
  }

  get inputProps() {
    const { disabled, readOnly, accept, minLength,
      required, name, controlClasses, maxLength, list,
      placeholder: prePlaceholder, step, noValidate, multiple, autoComplete,
      min, max, pattern, dir, _propsControl = {} } = this.props;
    const { value, error } = this.state;
    const cn = [
      'form-control',
      controlClasses, error ? 'is-invalid' : ''
    ];
    if (autoComplete === false) {
      var autocomplete = 'off';
      var list1 = 'autocompleteOff';
    }
    const placeholder = !!prePlaceholder ? this.extractString(prePlaceholder) : null;
    return {
      id: name, name, autoComplete: autocomplete || autoComplete,
      list: list1 || list, pattern, placeholder,
      required, type: this.type,
      value, className: cn.join(' '),
      min, max, step, noValidate, disabled,
      readOnly, ref: this.input, dir, accept,
      multiple, maxLength, minLength,
      onChange: this.onChange,
      onInvalid: this.onInvalid,
      onFocus: this.onFocus,
      ..._propsControl
    }
  }

  get labelNode() {
    const { placeholder, required, name, labelClasses,
      inline, label } = this.props;
    const cn = ['form-label', labelClasses];
    if (inline) { cn.shift(); cn.push('py-2') }
    const labelNode = <label className={cn.join(' ')} htmlFor={name}>
      {label ? label : placeholder}
      {required && <b title="Este campo es indispensable" className="text-inherit"> *</b>}
    </label>
    return (labelNode);
  }

  get inputNode() {
    const inputNode = (<input {...this.inputProps} />);
    return inputNode;
  }

  get errorMessageNode() {
    const { errorMessage } = this.props;
    const { error } = this.state;
    const errorNode = (<p className="m-1 lh-1"><small className="text-danger">
      {errorMessage}
    </small></p>);
    return (error && errorMessage && errorNode);
  }

  get messageNode() {
    const { message, messageClasses } = this.props;
    const cnm = ['m-1 lh-1'];
    if (messageClasses) cnm.push(messageClasses);
    const node = (<p className={cnm.flat().join(' ')}><small>
      {message}
    </small></p>);
    return (message && node);
  }

  content(children = this.props.children) {
    const { inline, first, placeholder, label, floating, inlineControlClasses } = this.props;
    const cn = ['position-relative'];
    if (inline) cn.push('d-flex');
    if (placeholder && !label && floating) cn.push('form-floating');
    const wrapProps = {};
    const className = cn.join(' ');
    if (this.ContentWrap !== Fragment) wrapProps.className = className;
    return (<>
      <this.ContentWrap {...wrapProps}>
        {floating && (first === 'label' && label) && this.labelNode}
        {inline ? <div className={inlineControlClasses}>
          {this.inputNode}
          {this.errorMessageNode}
          {this.messageNode}
        </div> : this.inputNode}
        {floating && (first !== 'label' || (placeholder && !label)) && this.labelNode}
        {!inline && <>
          {this.errorMessageNode}
          {this.messageNode}
        </>}
      </this.ContentWrap>
      {children}
    </>);
  }
};