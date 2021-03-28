import React, { createRef } from "react";
import PropTypes from "prop-types";
import { randomS4 } from "../functions";
import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class FormContainer extends Component {

  static propTypes = {
    ...Component.propTypes,
    label: PropTypes.string,
    labelClasses: PropTypes.string,
    fields: PropTypes.array
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
  }

  componentDidMount() {
    this.props.fields.forEach(field => {
      eventHandler.subscribe(field.name, this.onChange, this.unique);
      eventHandler.subscribe('invalid.' + field.name, this.onInvalidField, this.unique);
    });
    eventHandler.subscribe('update.' + this.props.name, this.onUpdate, this.unique);
    // set defaults dont propagate event
    this.reset(true);
    this.toggleSubmit();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutInvalid);
    this.props.fields.forEach(field => {
      eventHandler.unsubscribe(field.name, this.unique);
      eventHandler.unsubscribe('invalid.' + field.name, this.unique);
    });
    eventHandler.unsubscribe('update.' + this.props.name, this.unique);
  }

  reset(dontDispatch) {
    const dataDefault = {}
    this.props.fields.forEach((field) => {
      if (typeof field.default === 'undefined') return;
      dataDefault[field.name] = field.default;
      if (!dontDispatch) eventHandler.dispatch('update.' + field.name, { reset: true });
    });
    this.setState({ data: dataDefault });
  }

  onUpdate = ({ data, loading, reset }) => {
    if (data) {
      Object.keys(data || {}).forEach((itemName) => {
        const field = this.props.fields.find(field => field.name === itemName);
        if (!field) return;
        eventHandler.dispatch('update.' + field.name, { value: data[itemName] });
      });
      this.setState({ ...this.state.data, ...data });
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

  content(children = this.props.children) {
    const { label, labelClasses } = this.props;
    return (<form onSubmit={this.onSubmit} onInvalid={this.onInvalid} ref={this.form} >
      {label && <label className={labelClasses}>{label}</label>}
      {children}
    </form>);
  }
}