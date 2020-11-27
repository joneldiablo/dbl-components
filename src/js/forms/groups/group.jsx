import React from "react";
import Field from "../fields/field";

const formatComponents = {

}

export const setFormatComponents = (_components) => {
  Object.assign(formatComponents, _components);
}

export default class GroupField extends React.Component {

  static defaultProps = {
    label: null,
    name: null,
    fields: [],
    className: '',
    style: {},
    classNameFields: 'mb-3 px-2',
    format: null
  }

  Format = formatComponents[this.props.format];

  label() {
    let { label, classNameFields } = this.props;
    return label && <>
      <div className={classNameFields}><h1 className="h2">{label}</h1></div>
      <div className="h-100 border-bottom"></div>
    </>
  }

  content() {
    let { fields, classNameFields } = this.props;
    return <>
      {this.label()}
      {fields.map((field, i) => {
        let cnf = [field.className, classNameFields].filter(c => !!c);
        field.className = cnf.join(' ');
        return <Field key={i} {...field} />
      })}
    </>
  }

  render() {
    let { className, style, ...props } = this.props;
    let cn = [this.constructor.name, className, 'group-' + props.name].join(' ');
    return <div className={cn} style={style}>
      {this.Format ?
        <this.Format {...props} /> :
        this.content()
      }
    </div>
  }
}