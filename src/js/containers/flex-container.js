import PropTypes from 'prop-types';
import React from "react";

export default class FlexContainer extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    colClassNames: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    style: PropTypes.object,
  }

  static jsClass = 'FlexContainer';
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

    return React.createElement('div', { className: colcn.flat().join(' '), key: i },
      child
    );
  }

  render() {
    let { className, style, children } = this.props;
    let cn = [this.constructor.jsClass, className, 'd-flex'].flat().join(' ');
    return React.createElement('div', { className: cn, style },
      Array.isArray(children) && children.map(this.column)
    );
  }
}