import React from "react";

import DropdownButtonContainer from "./dropdown-button-container";

export default class DropdownContainer extends DropdownButtonContainer {

  static jsClass = 'DropdownContainer';

  constructor(props) {
    super(props);
    this.trigger = props.name + 'Span';
  }

  content(children = this.props.children) {
    const { btnClasses, label, value, disabled } = this.props;
    const cn = [btnClasses];
    if (this.props.dropdownClass !== false) cn.unshift('dropdown-toggle');
    return React.createElement(React.Fragment, {},
      (label || value) && React.createElement('span',
        {
          className: cn.flat().join(' '),
          'data-bs-toggle': "dropdown",
          disabled: disabled,
          id: this.trigger,
          onClick: this.onToggleDrop.bind(this),
          ref: (ref) => this.refBtn(ref),
          style: { cursor: 'pointer' }
        },
        label || value
      ),
      this.dropdownRender(children)
    );
  }
}