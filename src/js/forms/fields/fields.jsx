import React from "react";
import GroupField from "../groups/group";
import HiddenField from "./hidden-field";
import SelectField from "./select-field";

const fieldComponents = {
  'group': GroupField,
  'hidden': HiddenField,
  'select': SelectField
}

export const setFieldComponents = (_components) => {
  Object.assign(fieldComponents, _components);
}

export default class Field extends React.Component {

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
        this.content()
      }
    </div>
  }
}
