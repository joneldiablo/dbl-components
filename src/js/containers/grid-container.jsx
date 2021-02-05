import React from "react";
import Container from "./container";

export default class GridContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    colClasses: [],
    fullWidth: true,
    row: 'height-auto'
  }

  constructor(props) {
    super(props);
  }

  grid(children = this.props.children, classes = []) {
    const { colClasses, row } = this.props;
    return (<div className={'row ' + row}>
      {Array.isArray(children) && children.map((child, i) => {
        let colcn = ['col-md', i % 2 ? 'even' : 'odd', 'col-num-' + i];
        // unir clases generales, si es un string se une  todas las columnas
        // si es un arreglo se une en su debido lugar y se repite la ultima clase 
        // si no coincide el número de columnas y clases
        if (typeof colClasses === 'string') colcn.push(colClasses);
        else if (Array.isArray(colClasses) && colClasses[i])
          colcn.push(colClasses[i]);
        else if (Array.isArray(colClasses) && colClasses.length > 0)
          colcn.push(colClasses[colClasses.length - 1]);
        colcn.push(classes[i]);
        return <div className={colcn.join(' ')} key={i}>
          {child}
        </div>
      })}
    </div>);
  }

  content(children = this.props.children){
    return this.grid(children);
  }

}