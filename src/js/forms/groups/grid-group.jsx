import React from "react";
import Group from "./group";

export default class GridGroup extends Group {

  columnClasses(colClasses, i) {
    let colcn = ['col-md', i % 2 ? 'even' : 'odd', 'col-num-' + i];
    // unir clases generales, si es un string se une  todas las columnas
    // si es un arreglo se une en su debido lugar y se repite la ultima clase 
    // si no coincide el número de columnas y clases
    if (typeof colClasses === 'string') colcn.push(colClasses);
    else if (Array.isArray(colClasses) && colClasses[i])
      colcn.push(colClasses[i]);
    else if (Array.isArray(colClasses) && colClasses.length > 0)
      colcn.push(colClasses[colClasses.length - 1]);
    return colcn.join(' ');
  }

  mapFields(field, i) {
    const { colClasses } = this.props;
    const cnc = ['col',
      this.columnClasses(colClasses, i),
      field.colClasses
    ];
    return (<div key={i} className={cnc.join(' ')}>
      {super.mapFields(field, i)}
    </div>);
  }

  mapChildren = (fieldNode, i) => {
    const { colClasses } = this.props;
    const cnc = ['col',
      this.columnClasses(colClasses, i),
      fieldNode.props.colClasses
    ];
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