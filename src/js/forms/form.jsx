import React, { createRef } from "react";
import PropTypes from 'prop-types';
import { randomS4 } from "../functions";
import eventHandler from "../functions/event-handler";
import Component from "../component";
import fieldComponents from "./fields";


export default class Form extends Component {

  static propTypes = {
    ...Component.propTypes,
    label: PropTypes.string,
    labelClasses: PropTypes.string,
    fieldClasses: PropTypes.string,
    fields: PropTypes.array,
    clearAfterDone: PropTypes.bool
  }

  static defaultProps = {
    ...Component.defaultProps,
    fieldClasses: 'mb-3',
    fields: []
  }

  unique = randomS4();
  fieldNames = new Set();

  constructor(props) {
    super(props);
    this.form = createRef();
    this.mapFields = this.mapFields.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state.data = {};
  }

  componentDidMount() {
    this.fieldNames.forEach(fieldName => {
      eventHandler.subscribe(fieldName, this.onChange, this.unique);
      eventHandler.subscribe('invalid.' + fieldName, this.onInvalidField, this.unique);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInvalid);
    this.fieldNames.forEach(fieldName => {
      eventHandler.unsubscribe(fieldName, this.unique);
      eventHandler.unsubscribe('invalid.' + fieldName, this.unique);
    });
  }

  clear() {
    let { clearAfterDone } = this.props;
    if (clearAfterDone)
      this.defaults();
  }

  defaults() {
    // TODO: cargar valores default
    this.setState({ data: {} });
  }

  onInvalid = (e) => {
    const { invalidFields } = this.state;
    clearTimeout(this.timeoutInvalid);
    this.timeoutInvalid = setTimeout(() => {
      eventHandler.dispatch('invalid.' + this.name, invalidFields);
    }, 400);
  }

  onInvalidField = (data) => {
    const { invalidFields } = this.state;
    // asignacion directa para no ejecutar un render
    this.state.invalidFields = { ...invalidFields, ...data };
  }

  onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = this.state;
    eventHandler.dispatch(this.name, data);
  }

  onChange(fieldData) {
    const { data, invalidFields = {} } = this.state;
    // remove elements from invalids
    Object.keys(fieldData).forEach(key => {
      delete invalidFields[key];
    });
    Object.assign(data, fieldData);
    this.setState({ data, invalidFields });
    eventHandler.dispatch('change.' + this.name, data);
    if (this.form.current?.checkValidity()) {
      eventHandler.dispatch('valid.' + this.name, data);
    }
  }

  mapFields(field, i) {
    const { fieldClasses } = this.props;
    if (!this.state.data[field.name] && typeof field.default !== 'undefined')
      // asignación directa, no provocar render
      this.state.data[field.name] = field.default;
    const DefaultField = field.type?.toLowerCase().includes('group') ?
      fieldComponents.Group :
      fieldComponents.Field
    const Field = (fieldComponents[field.type] || DefaultField);
    this.fieldNames.add(field.name + '-' + Field.name);
    const cn = [field.classes, fieldClasses];
    const fieldProps = {
      key: i + '-' + field.name,
      ...field,
      classes: cn.join(' ')
    }
    if (field.fields) {
      fieldProps.children = field.fields.map(this.mapFields);
      delete fieldProps.fields;
    }
    return (<Field {...fieldProps} />);
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses } = this.props;
    return (<form onSubmit={this.onSubmit} onInvalid={this.onInvalid} ref={this.form} >
      {label && <label className={labelClasses}>{label}</label>}
      {fields && fields.map(this.mapFields)}
      {children}
    </form>);
  }
}
