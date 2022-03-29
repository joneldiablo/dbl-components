import React from "react";
import { Dropdown } from "bootstrap";

import eventHandler from "../functions/event-handler";
import Component from "../component";

export class DropdownItem extends React.Component {

  onClick = (e) => {
    const { onClick, value } = this.props;
    if (typeof onClick === 'function') onClick(value);
    else eventHandler.dispatch('DropdownItem.' + value);
  }

  render() {
    const { children } = this.props;
    return (<button className="dropdown-item" type="button"
      onClick={this.onClick}>{children}</button>);
  }

}

export default class DropdownButtonContainer extends Component {

  static jsClass = 'DropdownButtonContainer';

  classes = 'dropdown';

  constructor(props) {
    super(props);
    this.style.width = 'fit-content';
  }

  toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  onClick = (value) => {
    const { onClick, name } = this.props;
    if (typeof onClick === 'function') onClick({ [name]: value });
    else eventHandler.dispatch(name, value);
  }

  refBtn(btn) {
    if (!btn) return;
    if (this.bsDropdown) this.bsDropdown.dispose();
    this.bsDropdown = new Dropdown(btn);
  }

  componentWillUnmount() {
    if (this.bsDropdown) this.bsDropdown.dispose();
  }

  content(children = this.props.children) {
    const { btnClasses, label, value, menu, allowClose, disabled } = this.props;
    const cn = ['btn dropdown-toggle', btnClasses];
    return <>
      <button className={cn.join(' ')} type="button"
        ref={ref => this.refBtn(ref)}
        data-bs-toggle="dropdown"
        disabled={disabled} id={this.props.name + 'Btn'}
        onClick={this.toggleDropdown}>
        {label || value}
      </button>
      <div className="dropdown-menu" style={{ minWidth: '100%' }}
        onClick={allowClose ? null : (e) => e.stopPropagation()}
        aria-labelledby={this.props.name + 'Btn'}>
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