import React from "react";
import Field from "../fields/field";

const formats = {

}

export const setFormats = (_formats) => {
  Object.assign(formats, _formats);
}

export default class GroupField extends React.Component {

  static defaultProps = {
    label: null,
    name: null,
    fields: [],
    className: '',
    style: {}
  }

  group(props) {
    let { fields, label } = props;
    return <>
      {label && <>
        <h1 className="h2 px-2">Editar {label}</h1>
        <hr />
      </>}
      <div className="px-2">
        {fields.map(field => <Field key={field.name} {...field} className="mb-3" />)}
      </div>
    </>
  }

  render() {
    let { fields, label, className, style, format, name } = this.props;
    let Group = formats[format];
    let props = { fields, label, name };
    let cn = [this.constructor.name, className].join(' ');
    return <div className={cn} stye={style}>
      {Group ? <Group {...props} /> :
        this.group(props)
      }
    </div>
  }
}