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

  li(children = this.props.children, extraClasses) {
    const { liClasses } = this.props;
    return Array.isArray(children) && children.map((child, i) => {
      if (!child) return false;
      let licn = [i % 2 ? 'even' : 'odd', 'li-num-' + i];
      const theChildConf = (!(child.props.style && child.props.style['--component-name'])
      ? child : child.props.children).props;
      const childLiClasses = theChildConf?.liClasses;
      if (childLiClasses) licn.push(childLiClasses);
      // unir clases generales, si es un string se une  todas las columnas
      // si es un arreglo se une en su debido lugar y se repite la ultima clase 
      // si no coincide el número de columnas y clases
      if (typeof liClasses === 'string') licn.push(liClasses);
      else if (Array.isArray(liClasses) && liClasses[i])
        licn.push(liClasses[i]);
      else if (Array.isArray(liClasses) && liClasses.length > 0)
        licn.push(liClasses[liClasses.length - 1]);

      if (typeof extraClasses === 'string') licn.push(extraClasses);
      else if (Array.isArray(extraClasses) && extraClasses[i])
        licn.push(extraClasses[i]);
      else if (Array.isArray(extraClasses) && extraClasses.length > 0)
        licn.push(extraClasses[extraClasses.length - 1]);

      return React.createElement('li',
        { className: licn.flat().join(' '), key: i },
        child
      )
    }).filter(c => !!c);
  }

  content(children = this.props.children) {
    return !!this.breakpoint ? this.li(children) : this.waitBreakpoint;
  }

}