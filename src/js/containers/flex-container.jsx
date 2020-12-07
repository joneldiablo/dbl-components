import React from "react";

export default class FlexContainer extends React.Component {

  static defaultProps = {
    className: '',
    style: {},
    colClassNames: []
  }

  column = (child, i) => {
    let { colClassNames } = this.props;
    let colcn = [];
    if (typeof colClassNames === 'string') colcn.push(colClassNames);
    else if (Array.isArray(colClassNames) && colClassNames[i])
      colcn.push(colClassNames[i]);
    else if (Array.isArray(colClassNames) && colClassNames.length > 0)
      colcn.push(colClassNames[colClassNames.length - 1]);

    return <div className={colcn.join(' ')} key={i}>
      {child}
    </div>
  }

  render() {
    let { className, style, children } = this.props;
    let cn = [this.constructor.name, className, 'd-flex'].join(' ');
    return (<div className={cn} style={style}>
      {Array.isArray(children) && children.map(this.column)}
    </div>);
  }
}