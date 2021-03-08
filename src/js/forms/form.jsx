import React, { createRef } from "react";
import PropTypes from 'prop-types';
import Component from "../component";
import fieldComponents from "./fields";


export default class Form extends Component {

  static propTypes = {
    ...Component.propTypes,
    clearAfterDone: PropTypes.bool,
    fields: PropTypes.array,
    fieldClasses: PropTypes.string,
    title: PropTypes.string,
    titleClasses: PropTypes.string,
    Template: PropTypes.node,
    templateProps: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onValid: PropTypes.func,
    onInvalid: PropTypes.func
  }

  static defaultProps = {
    ...Component.defaultProps,
    fields: [],
    fieldClasses: 'mb-3'
  }

  constructor(props) {
    super(props);
    this.form = createRef();
    this.onChange = this.onChange.bind(this);
    this.state = {
      data: {}
    };
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
    const { onInvalid } = this.props;
    const { data } = this.state;
    if (typeof onInvalid === 'function')
      onInvalid(data);
  }

  onInvalidField = (data) => { console.log('onInvalidField event', data) }
  onValidField = (data) => { console.log('onValidField event', data) }

  onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { onSubmit } = this.props;
    const { data } = this.state;
    if (typeof onSubmit === 'function')
      onSubmit(data, e);
  }

  onChange(fieldData) {
    const { onChange, onValid } = this.props;
    const { data } = this.state;
    Object.assign(data, fieldData);
    this.setState({ data });
    if (typeof onValid === 'function' && this.form.current?.checkValidity()) {
      onValid(data, this.form.current);
    }
    if (typeof onChange === 'function')
      onChange(data);
  }

  mapFields = (field, i) => {
    const { fieldClasses } = this.props;
    const DefaultField = field.type?.toLowerCase().includes('group') ?
      fieldComponents.Group :
      fieldComponents.Field
    const Field = (fieldComponents[field.type] || DefaultField);
    const cn = [field.classes, fieldClasses];
    const fieldProps = {
      key: i + '-' + field.name,
      ...field,
      classes: cn.join(' '),
      onChange: this.onChange,
      onInvalid: this.onInvalidField,
      onValid: this.onValidField
    }
    return <Field {...fieldProps} />
  }

  content(children = this.props.children) {
    const { Template, templateProps, fields } = this.props;
    return (<form onSubmit={this.onSubmit} onInvalid={this.onInvalid} ref={this.form} >
      {Template ?
        <Template {...templateProps} >
          {fields.map(this.mapFields)}
        </Template> :
        fields.map(this.mapFields)}
      {children}
    </form >);
  }
}
