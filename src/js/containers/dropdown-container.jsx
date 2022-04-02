import React from "react";

import DropdownButtonContainer, { DropdownItem } from "./dropdown-button-container";

export default class DropdownContainer extends DropdownButtonContainer {

  static jsClass = 'DropdownContainer';

  constructor(props) {
    super(props);
    this.trigger = props.name + 'Span';
  }

  content(children = this.props.children) {
    const { spanClasses, label, value, disabled } = this.props;
    const cn = ['dropdown-toggle', spanClasses];
    return <>
      <span className={cn.join(' ')} ref={ref => this.refBtn(ref)}
        data-bs-toggle="dropdown" disabled={disabled} id={this.trigger}
        onClick={this.toggleDropdown} style={{ cursor: 'pointer' }}>
        {label || value}
      </span>
      {this.dropdownRender(children)}
    </>
  }
}