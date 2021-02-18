import React from "react";
import PropTypes from 'prop-types';
import schemaManager from "../functions/schema-manager"
import DefaultField from "./fields/field";
import Hidden from "./fields/hidden-field";
import Select from "./fields/select-field";


const fieldComponents = {
  hidden: Hidden,
  Select,
  Field: DefaultField
}

export const setFieldComponents = (_components) => {
  Object.assign(fieldComponents, _components);
}

export const Fields = ({ className, style, ...props }) => {
  let Field = (fieldComponents[props.type] || DefaultField);
  let cn = ['field', 'mb-3', props.name + '-field', className];
  return (<div className={cn.join(' ')} style={style}>
    <Field {...props} />
  </div>);
}

export default class Form extends React.Component {

  static propTypes = {
    clearAfterDone: PropTypes.bool,
    headers: PropTypes.object,
    fields: PropTypes.array,
    classes: PropTypes.string,
    style: PropTypes.object,
    template: PropTypes.node,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onInvalid: PropTypes.func
  }

  static defaultProps = {
    fields: [],
    className: '',
    style: {}
  }

  constructor(props) {
    super(props);
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
    this.setState({ data: {} });
  }

  onInvalid = (e) => {
    const { onInvalid } = this.props;
    const { data } = this.state;
    if (typeof onInvalid === 'function')
      onInvalid(data, e);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { onSubmit } = this.props;
    const { data } = this.state;
    if (typeof onSubmit === 'function')
      onSubmit(data, e);
  }

  onChange(fieldData) {
    const { onChange } = this.props;
    const { data } = this.state;
    this.setState({ data: { ...data, ...fieldData } });
    if (typeof onChange === 'function')
      onChange(fieldData);
  }

  render() {
    let { className, style, children, Template, templateProps, fields: propsFields } = this.props;
    let fields = schemaManager.resolveRefs(propsFields);
    let cn = [this.constructor.name, className].join(' ');
    let formFields = (Array.isArray(fields) && fields.map((field, i) =>
      <Fields key={'' + i + field.name} {...field} onChange={this.onChange} />
    ));

    return (<div className={cn} style={style}>
      <form onSubmit={this.onSubmit} onInvalid={this.onInvalid}>
        {Template ?
          <Template {...templateProps}>
            {formFields}
          </Template> :
          formFields
        }
        {children}
      </form>
    </div>);
  }
}
