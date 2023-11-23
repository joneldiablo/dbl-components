import React from "react";
import PropTypes from 'prop-types';

import fieldComponents from "../fields";
import Component from "../../component";

export default class Group extends Component {

  static jsClass = 'Group';
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

  constructor(props) {
    super(props);
    this.mapFields = this.mapFields.bind(this);
  }

  mapFields(field, i) {
    const { fieldClasses } = this.props;
    const DefaultField = field.type?.toLowerCase().includes('group') ?
      Group :
      fieldComponents.Field
    const Field = (fieldComponents[field.type] || DefaultField);

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
    return React.createElement(Field, { ...fieldProps });
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses } = this.props;
    return React.createElement(React.Fragment, {},
      label && React.createElement('label', { className: labelClasses }, label),
      fields && fields.map(this.mapFields),
      children
    );
  }

}