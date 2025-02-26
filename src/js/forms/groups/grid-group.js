import React from "react";

import Group from "./group";

export default class GridGroup extends Group {

  static jsClass = 'GridGroup';

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
    return colcn.flat().join(' ');
  }

  mapFields(field, i) {
    const { colClasses } = this.props;
    const cnc = ['col',
      this.columnClasses(colClasses, i),
      field.colClasses
    ];
    return React.createElement('div', { key: i, className: cnc.flat().join(' ') },
      super.mapFields(field, i)
    );
  }

  mapChildren = (fieldNode, i) => {
    const { colClasses } = this.props;
    const cnc = ['col',
      this.columnClasses(colClasses, i),
      fieldNode.props.colClasses
    ];
    return React.createElement('div',
      { key: i, className: cnc.flat().join(' ') },
      fieldNode
    );
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses, rowClasses } = this.props;
    const rcn = ['row', rowClasses];
    return React.createElement(React.Fragment, {},
      label && React.createElement('label',
        { className: labelClasses }, label),
      React.createElement('div', { className: rcn.flat().join(' ') },
        fields && fields.map(this.mapFields),
        children && children.map(this.mapChildren)
      )
    );
  }

}