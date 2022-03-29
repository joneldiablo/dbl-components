import React from "react";

import DropdownButtonContainer, { DropdownItem } from "./dropdown-button-container";

export default class DropdownContainer extends DropdownButtonContainer {

  static jsClass = 'DropdownContainer';

  content(children = this.props.children) {
    const { spanClasses, label, value, menu, allowClose, disabled } = this.props;
    const cn = ['dropdown-toggle', spanClasses];
    return <>
      <span className={cn.join(' ')} ref={ref => this.refBtn(ref)}
        data-bs-toggle="dropdown" disabled={disabled} id={this.props.name + 'Span'}
        onClick={this.toggleDropdown} style={{ cursor: 'pointer' }}>
        {label || value}
      </span>
      <div className="dropdown-menu" style={{ minWidth: '100%' }}
        onClick={allowClose ? null : (e) => e.stopPropagation()}
        aria-labelledby={this.props.name + 'Span'}>
        {menu && menu.map((item, i) => item !== 'divider' ?
          <DropdownItem value={item.value} onClick={this.onClick}
            key={item.name || i}>{item.label}</DropdownItem> :
          <div className="dropdown-divider" />
        )}
        {children}
      </div>
    </>
  }
}