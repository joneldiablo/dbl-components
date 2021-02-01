import React from "react";
import Container from "./container";

export default class GridContainer extends Container {

  static defaultProps = {
    ...Container.defaultProps,
    colClassNames: []
  }

  content(children = this.props.children) {
    const { colClassNames, fluid, fullWidth, gutter } = this.props;
    const containerType = (!fullWidth ? (fluid ? 'container-fluid' : 'container') : 'container-fullwidth');
    const cn = [containerType, 'g-0'];
    return (<div className={cn.join(' ')}>
      <div className={'row ' + gutter}>
        {Array.isArray(children) && children.map((child, i) => {
          let colcn = ['col col-12 col-sm'];
          // unir clases generales, si es un string se une  todas las columnas
          // si es un arreglo se une en su debido lugar y se repite la ultima clase 
          // si no coincide el número de columnas y clases
          if (typeof colClassNames === 'string') colcn.push(colClassNames);
          else if (Array.isArray(colClassNames) && colClassNames[i])
            colcn.push(colClassNames[i]);
          else if (Array.isArray(colClassNames) && colClassNames.length > 0)
            colcn.push(colClassNames[colClassNames.length - 1]);

          return <div className={colcn.join(' ')} key={i}>
            {child}
          </div>
        })}
      </div>
    </div>);
  }

}