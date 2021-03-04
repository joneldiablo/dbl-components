import React from "react";
import PropTypes from "prop-types";
import fieldComponents from "../fields";
import Component from "../../component";


export default class Group extends Component {

  static propTypes = {
    ...Component.propTypes,
    fieldClasses: PropTypes.string,
    labelClasses: PropTypes.string
  }

  static defaultProps = {
    ...Component.defaultProps,
    fieldClasses: 'mb-3',
    fields: []
  }

  fieldProps(field) {
    const { fieldClasses, onChange, onValid, onInvalid } = this.props;
    const cn = [field.classes, fieldClasses];
    return {
      ...field,
      classes: cn.join(' '),
      onChange,
      onInvalid,
      onValid
    };
  }

  mapFields = (field, i) => {
    const DefaultField = field.type.toLowerCase().includes('group') ?
      fieldComponents.Group :
      fieldComponents.Field
    const Field = (fieldComponents[field.type] || DefaultField);
    return <Field key={i + '-' + field.name} {...this.fieldProps(field)} />
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses } = this.props;
    return <>
      {label && <label className={labelClasses}>{label}</label>}
      {fields.map(this.mapFields)}
      {children}
    </>
  }

}