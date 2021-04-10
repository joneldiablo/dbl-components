import React, { createRef } from "react";
import PropTypes from "prop-types";
import { randomS4 } from "../functions";
import eventHandler from "../functions/event-handler";
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
    this.state.data = {};
    this.state.invalidFields = {};
    this.events = [];
    this.fieldsForEach(field => {
      this.events.push([field.name, this.onChange, this.unique]);
      this.events.push(['invalid.' + field.name, this.onInvalidField, this.unique]);
    });
    this.events.push(['update.' + props.name, this.onUpdate, this.unique]);
    this.events.push(['default.' + props.name, this.onDefault, this.unique]);
  }

  componentDidMount() {
    this.events.forEach(event => eventHandler.subscribe(...event));
    // set defaults dont propagate event
    this.reset(true);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInvalid);
    this.events.forEach(([eventName]) => eventHandler.unsubscribe(eventName));
  }

  fieldsForEach(func) {
    const { fields } = this.props;
    if (Array.isArray(fields)) fields.forEach(func);
    else Object.keys(fields)
      .forEach((name, i) => func({ name, ...fields[name] }, i));
  }

  reset(dontDispatch) {
    const dataDefault = {};
    this.fieldsForEach(field => {
      if (typeof field.default === 'undefined') return;
      dataDefault[field.name] = field.default;
      if (!dontDispatch) eventHandler.dispatch('update.' + field.name, { reset: true });
    });
    this.setState({ data: dataDefault });
  }

  onUpdate = ({ data, reset }) => {
    if (data) {
      Object.keys(data).forEach(fieldName => {
        eventHandler.dispatch('update.' + fieldName, { value: data[fieldName] });
      });
      this.setState({ data: { ...this.state.data, ...data } });
    }
    if (typeof reset === 'boolean') {
      this.reset();
    }
  }

  onDefault = (data) => {
    Object.keys(data).forEach(fieldName => {
      eventHandler.dispatch('update.' + fieldName, { value: data[fieldName] });
    });
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
    if (this.form.current?.checkValidity()) {
      eventHandler.dispatch('valid.' + this.props.name, data);
    }
  }

  content(children = this.props.children) {
    const { label, labelClasses } = this.props;
    return (<form onSubmit={this.onSubmit} onInvalid={this.onInvalid} ref={this.form} >
      {label && <label className={labelClasses}>{label}</label>}
      {children}
    </form>);
  }
}