import React, { createRef } from "react";
import PropTypes from "prop-types";

import { randomS4, eventHandler } from "dbl-utils";

import Component from "../component";

export default class FormContainer extends Component {

  static jsClass = 'FormContainer';
  static propTypes = {
    ...Component.propTypes,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelClasses: PropTypes.string,
    fields: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  }

  static defaultProps = {
    ...Component.defaultProps,
    fields: []
  }

  unique = randomS4();

  constructor(props) {
    super(props);
    this.form = createRef();
    this.onChange = this.onChange.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.state.data = {};
    this.state.invalidFields = {};
    this.state.defaultValues = {};
    this.events = [
      ['update.' + props.name, this.onUpdate, this.unique],
      ['default.' + props.name, this.onDefault, this.unique]
    ];
    this.readyEvents = [];
    this.fieldsForEach(field => {
      this.events.push([field.name, this.onChange, this.unique]);
      this.events.push(['invalid.' + field.name, this.onInvalidField, this.unique]);
      this.readyEvents.push(['ready.' + field.name, this.onReadyOnce.bind(this), this.unique]);
      if (typeof field.default !== 'undefined') this.state.defaultValues[field.name] = field.default;
    });
    delete this.eventHandlers.onChange;
  }

  componentDidMount() {
    this.events.forEach(event => eventHandler.subscribe(...event));
    this.readyEvents.forEach(event => eventHandler.subscribe(...event));
    this.reset();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInvalid);
    clearTimeout(this.timeoutOnchage);
    clearTimeout(this.timeoutCheckvalidity);
    this.events.forEach(([eventName]) => eventHandler.unsubscribe(eventName, this.unique));
  }

  get componentProps() {
    const props = Object.assign({}, this.props._props || {});
    if (typeof props.onChange === 'function') {
      const past = this.props._props.onChange;
      props.onChange = () => {
        clearTimeout(this.timeoutOnchage);
        this.timeoutOnchage = setTimeout(() => past(this.state.data), 310);
      };
    }
    return props;
  }

  checkValidity() {
    clearTimeout(this.timeoutCheckvalidity);
    this.timeoutCheckvalidity = setTimeout(() =>
      this.form.current?.checkValidity()
      && eventHandler.dispatch('valid.' + this.props.name, this.state.data), 310);
  }

  onReadyOnce() {
    this.readyEvents.forEach(([eventName]) => eventHandler.unsubscribe(eventName, this.unique));
    eventHandler.dispatch('ready.' + this.props.name);
  }

  fieldsForEach(func) {
    const { fields } = this.props;
    if (Array.isArray(fields))
      fields.forEach((f, i) => func(typeof f === 'string' ? { name: f } : f, i));
    else Object.keys(fields)
      .forEach((name, i) => func({ name, ...fields[name] }, i));
  }

  onUpdate = ({ data, reset, default: dataDefault, update = true, clearData, mergeDefault }) => {
    if (clearData) {
      this.setState({ data: {} });
    }
    if (dataDefault) {
      this.mergeDefault = mergeDefault;
      this.onDefault(dataDefault);
    }
    if (data) {
      if (update)
        Object.keys(data).forEach(fieldName => {
          eventHandler.dispatch('update.' + fieldName, { value: data[fieldName] });
        });
      this.setState({ data: { ...this.state.data, ...data } }, this.checkValidity);
    }
    if (typeof reset === 'boolean') {
      this.reset();
    }
  }

  onDefault = (data) => {
    const defaultValues = {};
    this.fieldsForEach(field => {
      defaultValues[field.name] = data[field.name];
    });
    if (this.mergeDefault) {
      Object.assign(this.state.defaultValues, defaultValues);
    } else {
      this.state.defaultValues = defaultValues;
    }
    this.mergeDefault = null;
  }

  reset() {
    this.fieldsForEach(field => {
      if (this.state.defaultValues[field.name] !== undefined)
        eventHandler.dispatch('update.' + field.name, { value: this.state.defaultValues[field.name] });
      else
        eventHandler.dispatch('update.' + field.name, { clear: true, error: false });
    });
    this.setState({ data: {} });
  }

  onInvalid = (e) => {
    const { invalidFields } = this.state;
    // timeout becouse avery field trigger this onInvalid
    clearTimeout(this.timeoutInvalid);
    this.timeoutInvalid = setTimeout(() => {
      eventHandler.dispatch('invalid.' + this.props.name, invalidFields);
    }, 400);
  }

  onInvalidField = (invalidData) => {
    // Asignación directa para no ejecutar render
    Object.assign(this.state.invalidFields, invalidData);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = this.state;
    eventHandler.dispatch(this.props.name, data);
  }

  onChange(fieldData) {
    const { data, invalidFields } = this.state;
    // remove elements from invalids if now is valid
    Object.keys(fieldData).forEach(key => (delete invalidFields[key]));
    Object.assign(data, fieldData);
    this.setState({ data, invalidFields });
    eventHandler.dispatch('change.' + this.props.name, data);
    this.checkValidity();
  }

  content(children = this.props.children) {
    const { label, labelClasses, name } = this.props;
    return React.createElement('form',
      { onSubmit: this.onSubmit, onInvalid: this.onInvalid, ref: this.form, id: name + '-form' },
      label && React.createElement('label', { className: labelClasses }, label),
      children
    );
  }
}