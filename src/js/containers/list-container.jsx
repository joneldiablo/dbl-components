import React from "react";
import Container from "./container";

export default class ListContainer extends Container {

  static jsClass = 'ListContainer';
  static defaultProps = {
    ...Container.defaultProps,
    liClasses: [],
    fullWidth: true,
    tag: 'ul'
  }

  li(children = this.props.children) {
    const { liClasses } = this.props;
    return Array.isArray(children) && children.map((child, i) => {
      if (!child) return false;
      const theChild =
        (child.type === 'section' ? child.props.children.props : child.props);
      const childLiClasses = theChild?.liClasses;
      let licn = [i % 2 ? 'even' : 'odd', 'li-num-' + i, childLiClasses];
      // unir clases generales, si es un string se une  todas las columnas
      // si es un arreglo se une en su debido lugar y se repite la ultima clase 
      // si no coincide el número de columnas y clases
      if (typeof liClasses === 'string') licn.push(liClasses);
      else if (Array.isArray(liClasses) && liClasses[i])
        licn.push(liClasses[i]);
      else if (Array.isArray(liClasses) && liClasses.length > 0)
        licn.push(liClasses[liClasses.length - 1]);
      return <li className={licn.join(' ')} key={i}>
        {child}
      </li>
    });
  }

  content(children = this.props.children) {
    return !!this.breakpoint && this.li(children);
  }

}