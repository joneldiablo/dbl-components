import React from "react";
import Field from "./field";
import GroupField from "../groups/group";
import HiddenField from "./hidden-field";
import SelectField from "./select-field";
import PropTypes from 'prop-types';

const fieldComponents = {
  'group': GroupField,
  'hidden': HiddenField,
  'select': SelectField
}

export const setFieldComponents = (_components) => {
  Object.assign(fieldComponents, _components);
}

export default class Fields extends React.Component {

  static propTypes = {
    ...Field.propTypes,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    className: 'mb-3',
    style: {}
  }

  Field = fieldComponents[this.props.type];

  // Renders
  content() {
    return super.render();
  }

  render() {
    let { className, style, ...props } = this.props;
    let cn = [this.constructor.name, className, 'field-' + props.name].join(' ');
    return <div className={cn} style={style}>
      {this.Field ?
        <this.Field {...props} /> :
        <Field {...props} />
      }
    </div>
  }
}
