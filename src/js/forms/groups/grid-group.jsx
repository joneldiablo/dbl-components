import React from "react";
import fieldComponents from "../fields";
import Group from "./group";

export default class GridGroup extends Group {

  mapFields = (field, i) => {
    const { colClasses } = this.props;
    const DefaultField = field.type.toLowerCase().includes('group') ?
      fieldComponents.Group :
      fieldComponents.Field
    const Field = (fieldComponents[field.type] || DefaultField);
    const cnc = ['col', colClasses, field.colClasses];
    return (<div key={i} className={cnc.join(' ')}>
      <Field key={i + '-' + field.name} {...this.fieldProps(field)} />
    </div>);
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses, rowClasses } = this.props;
    const rcn = ['row', rowClasses];
    return <>
      {label && <label className={labelClasses}>{label}</label>}
      <div className={rcn.join(' ')}>{fields.map(this.mapFields)}</div>
      {children}
    </>
  }

}