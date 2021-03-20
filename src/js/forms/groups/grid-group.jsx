import React from "react";
import Group from "./group";

export default class GridGroup extends Group {

  mapFields(field, i) {
    const { colClasses } = this.props;
    const cnc = ['col', colClasses, field.colClasses];
    return (<div key={i} className={cnc.join(' ')}>
      {super.mapFields(field, i)}
    </div>);
  }

  mapChildren = (fieldNode, i) => {
    const { colClasses } = this.props;
    const cnc = ['col', colClasses, fieldNode.props.colClasses];
    return (<div key={i} className={cnc.join(' ')}>
      {fieldNode}
    </div>);
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses, rowClasses } = this.props;
    const rcn = ['row', rowClasses];
    return <>
      {label && <label className={labelClasses}>{label}</label>}
      <div className={rcn.join(' ')}>
        {fields && fields.map(this.mapFields)}
        {children && children.map(this.mapChildren)}
      </div>
    </>
  }

}