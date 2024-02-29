import React, { Fragment, createRef } from "react";
import PropTypes from "prop-types";
import { randomS4 } from "../../functions";
import eventHandler from "../../functions/event-handler";
import Component from "../../component";

export default class Field extends Component {

  static jsClass = 'Field';
  static propTypes = {
    ...Component.propTypes,
    accept: PropTypes.string,
    autoComplete: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    checkValidity: PropTypes.func,
    controlClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    default: PropTypes.any,
    disabled: PropTypes.bool,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
    first: PropTypes.oneOf(['label', 'control']),
    floating: PropTypes.bool,
    hidden: PropTypes.bool,
    inline: PropTypes.bool,
    inlineControlClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.node]),
    messageClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    multiple: PropTypes.bool,
    noValidate: PropTypes.bool,
    pattern: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
    value: PropTypes.any,
    options: PropTypes.arrayOf(PropTypes.shape({
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.bool, PropTypes.object]),
      value: PropTypes.any,
    })),
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
    error: false,
    pristine: true,
    dirty: false
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
    clearTimeout(this.timeoutReturnData);
    clearTimeout(this.timeoutRevalidate);
    eventHandler.unsubscribe('update.' + this.props.name, this.unique);
  }

  extractString(obj) {
    if (typeof obj === 'string') return obj;
    else if (Array.isArray(obj)) {
      return obj.map(e => this.extractString(e)).flat().join(' ');
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
      clearTimeout(this.timeoutReturnData);
      this.timeoutReturnData = setTimeout(() => {
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
      error,
      pristine: false,
      dirty: true
    }, () => this.returnData());
  }

  onUpdate({ value, options, error, reset }) {
    const newState = {};
    if (typeof value !== 'undefined') {
      newState.value = (value !== null ? value : this.props.default);
      newState.dirty = newState.value === this.props.default;
      newState.pristine = newState.value !== this.props.default;
    }
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
      if (value === undefined) return;
      clearTimeout(this.timeoutRevalidate);
      this.timeoutRevalidate = setTimeout(() => {
        //if (this.state.dirty) this.input.current.reportValidity();
        const error = this.isInvalid(value);
        if (this.state.error !== error) this.setState({ error });
      }, 300);

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
      min, max, pattern, dir, _propsControl = {}, hidden } = this.props;
    const { value, error } = this.state;
    const cn = ['form-control'];
    if (controlClasses) cn.push(controlClasses);
    if (error) cn.push('is-invalid');
    if (autoComplete === false) {
      var autocomplete = 'off';
      var list1 = 'autocompleteOff';
    }
    const placeholder = !!prePlaceholder ? this.extractString(prePlaceholder) : null;
    return {
      id: name, name, autoComplete: autocomplete || autoComplete,
      list: list1 || list, pattern, placeholder, hidden,
      required, type: this.type,
      value, className: cn.flat().join(' '),
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
      inline, label, disabled } = this.props;
    const cn = ['form-label', labelClasses];
    if (inline) { cn.shift(); cn.push('py-2') }
    const style = {};
    if (disabled) style['opacity'] = .9;
    const labelNode = React.createElement('label',
      { className: cn.flat().join(' '), htmlFor: name, style },
      label ? label : placeholder,
      required && React.createElement('b',
        {
          title: "Este campo es indispensable",
          className: "text-inherit"
        },
        ' *'
      )
    );
    return (labelNode);
  }

  get inputNode() {
    const inputNode = (React.createElement('input', { ...this.inputProps }));
    return inputNode;
  }

  get errorMessageNode() {
    const { errorMessage } = this.props;
    const { error } = this.state;
    const errorNode = React.createElement('p', { className: "m-1 lh-1" },
      React.createElement('small', { className: "text-danger" },
        errorMessage
      )
    );
    return (error && errorMessage && errorNode);
  }

  get messageNode() {
    const { message, messageClasses } = this.props;
    const cnm = ['m-1 lh-1'];
    if (messageClasses) cnm.push(messageClasses);
    const node = React.createElement('p',
      { className: cnm.flat().join(' ') },
      React.createElement('small', {},
        message
      ));
    return (message && node);
  }

  content(children = this.props.children) {
    const { inline, first, placeholder, label, floating, inlineControlClasses } = this.props;
    const cn = ['position-relative'];
    if (inline) cn.push('d-flex align-items-center');
    if (placeholder && !label && floating) cn.push('form-floating');
    const wrapProps = {};
    const className = cn.flat().join(' ');
    if (this.ContentWrap !== Fragment) wrapProps.className = className;
    return (React.createElement(React.Fragment, {},
      React.createElement(this.ContentWrap,
        { ...wrapProps },
        floating && (first === 'label' && label) && this.labelNode,
        inline
          ? React.createElement('div', { className: inlineControlClasses },
            this.inputNode,
            this.errorMessageNode,
            this.messageNode
          )
          : this.inputNode,
        floating && (first !== 'label' || (placeholder && !label)) && this.labelNode,
        !inline && React.createElement(React.Fragment, {},
          this.errorMessageNode,
          this.messageNode,
        ),
        children
      )
    ));
  }
};