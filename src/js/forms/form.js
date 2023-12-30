import React, { createRef } from "react";
import PropTypes from 'prop-types';
import { randomS4 } from "../functions";
import eventHandler from "../functions/event-handler";
import Component from "../component";
import fieldComponents from "./fields";

export default class Form extends Component {

  static jsClass = 'Form';
  static propTypes = {
    ...Component.propTypes,
    label: PropTypes.string,
    labelClasses: PropTypes.string,
    fieldClasses: PropTypes.string,
    fields: PropTypes.array
  }
  static defaultProps = {
    ...Component.defaultProps,
    fieldClasses: 'mb-3',
    fields: []
  }

  unique = randomS4();
  fieldNames = new Set();
  allFields = {};

  constructor(props) {
    super(props);
    this.form = createRef();
    this.mapFields = this.mapFields.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state.data = {};
    this.state.invalidFields = {};
  }

  componentDidMount() {
    Object.keys(this.allFields).forEach(fieldName => {
      let prefix = '';
      if (fieldName.endsWith('-Form')) prefix = 'change.';
      eventHandler.subscribe(prefix + fieldName, this.onChange, this.unique);
      eventHandler.subscribe('invalid.' + fieldName, this.onInvalidField, this.unique);
    });
    eventHandler.subscribe('update.' + this.props.name, this.onUpdate, this.unique);
    // set defaults dont propagate event
    this.reset(true);
    this.toggleSubmit();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInvalid);
    Object.keys(this.allFields).forEach(fieldName => {
      let prefix = '';
      if (fieldName.endsWith('-form')) prefix = 'change.';
      eventHandler.unsubscribe(prefix + fieldName, this.unique);
      eventHandler.unsubscribe('invalid.' + fieldName, this.unique);
    });
    eventHandler.unsubscribe('update.' + this.props.name, this.unique);
  }

  reset(dontDispatch) {
    const dataDefault = {}
    Object.keys(this.allFields).forEach((fieldName) => {
      const field = this.allFields[fieldName];
      dataDefault[field.name] = field.default;
      if (!dontDispatch) eventHandler.dispatch('update.' + fieldName, { reset: true });
    });
    this.setState({ data: dataDefault });
  }

  onUpdate = ({ data, loading, reset }) => {
    if (data) {
      Object.keys(data || {}).forEach((itemName) => {
        const fieldNames = Object.keys(this.allFields);
        const fieldName = fieldNames.find(fieldName => fieldName.startsWith(itemName));
        eventHandler.dispatch('update.' + fieldName, update[itemName]);
      });
      this.setState({ data: update });
    }
    if (typeof loading === 'boolean') {
      const enabled = !loading;
      this.toggleSubmit(enabled);
    }
    if (typeof reset === 'boolean') {
      this.reset();
    }
  }

  onInvalid = () => {
    const { invalidFields } = this.state;
    // timeout becouse avery field trigger this onInvalid
    clearTimeout(this.timeoutInvalid);
    this.timeoutInvalid = setTimeout(() => {
      eventHandler.dispatch('invalid.' + this.props.name, invalidFields);
      this.toggleSubmit();
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
      this.toggleSubmit(true);
    }
  }

  toggleSubmit(enabled) {
    // set disabled every button type=submit
    const submits = this.form.current.querySelectorAll('*[type=submit]');
    submits.forEach(s => {
      s.disabled = !enabled;
    });
  }

  mapFields(field, i) {
    const { fieldClasses } = this.props;
    let Field;
    if (field.type === 'Form') Field = Form;
    else {
      const isGroup = field.type?.toLowerCase().includes('group');
      const DefaultField = isGroup ?
        fieldComponents.Group :
        fieldComponents.Field
      Field = (fieldComponents[field.type] || DefaultField);
      if (!isGroup) {
        const fieldName = field.name;
        this.allFields[fieldName] = field;
      }
    }

    const cn = [field.classes, fieldClasses];
    const fieldProps = {
      key: i + '-' + field.name,
      ...field,
      classes: cn.flat().join(' ')
    }
    if (field.fields && field.type !== 'Form') {
      fieldProps.children = field.fields.map(this.mapFields);
      delete fieldProps.fields;
    }
    return React.createElement(Field, { ...fieldProps });
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses } = this.props;
    return React.createElement('form',
      { onSubmit: this.onSubmit, onInvalid: this.onInvalid, ref: this.form },
      label && React.createElement('label',
        { className: labelClasses }, label),
      fields && fields.map(this.mapFields),
      children
    );
  }
}
