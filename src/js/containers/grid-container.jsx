import React from "react";
import Container from "./container";

export default class GridContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    colClasses: [],
    fullWidth: true,
    row: 'height-auto'
  }

  classes = 'row';

  grid(children = this.props.children) {
    const { colClasses } = this.props;
    return Array.isArray(children) && children.map((child, i) => {
      if (!child) return false;
      const childColClasses =
        (child.type === 'section' ? child.props.children.props : child.props).colClasses;
      let colcn = ['col-md', i % 2 ? 'even' : 'odd', 'col-num-' + i, childColClasses];
      // unir clases generales, si es un string se une  todas las columnas
      // si es un arreglo se une en su debido lugar y se repite la ultima clase 
      // si no coincide el número de columnas y clases
      if (typeof colClasses === 'string') colcn.push(colClasses);
      else if (Array.isArray(colClasses) && colClasses[i])
        colcn.push(colClasses[i]);
      else if (Array.isArray(colClasses) && colClasses.length > 0)
        colcn.push(colClasses[colClasses.length - 1]);
      return <div className={colcn.join(' ')} key={i}>
        {child}
      </div>
    });
  }

  content(children = this.props.children) {
    return this.grid(children);
  }

}