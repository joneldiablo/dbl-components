import React from "react";
import { Dropdown } from "bootstrap";
import { NavLink } from "react-router-dom";

import eventHandler from "../functions/event-handler";
import Component from "../component";
import Icons from "../media/icons";

export class DropdownItem extends Component {

  static jsClass = 'DropdownItem';
  static defaultProps = {
    ...Component.defaultProps,
    badgeClasses: 'rounded-pill bg-danger'
  }

  classes = 'dropdown-item d-flex align-items-center';

  constructor(props) {
    super(props);
    if (typeof props.to === 'string') this.tag = NavLink;
    else this.tag = 'button';
    this.eventHandlers = {
      onClick: this.onClick
    }
  }

  onClick = (e) => {
    eventHandler.dispatch(this.props.name, { [this.props.name]: { value: this.props.value } });
  }

  get componentProps() {
    if (typeof this.props.to === 'string') {
      const {
        activeClassName,
        activeStyle,
        exact,
        strict,
        isActive,
        ariaCurrent,
        to,
        replace,
        innerRef,
        _component
      } = this.props;
      return {
        activeClassName,
        activeStyle,
        exact,
        strict,
        isActive,
        'aria-current': ariaCurrent,
        to,
        replace,
        innerRef,
        component: _component
      }
    } else return { ...super.componentProps, type: 'button' };
  }

  content(children = this.props.children) {
    const { label, icon, value, badgeClasses } = this.props;

    return <>
      {icon && <><Icons icon={icon} />&nbsp;</>}
      {label}
      {typeof value === 'number' &&
        <>&nbsp;<small className={['badge ms-auto', badgeClasses].join(' ')}>{value}</small></>}
      {children}
    </>
  }

}

export default class DropdownButtonContainer extends Component {

  static jsClass = 'DropdownButtonContainer';
  static defaultProps = {
    ...Component.defaultProps,
    itemClasses: '',
    dropdownClasses: '',
    btnClasses: ''
  }

  classes = 'dropdown';

  constructor(props) {
    super(props);
    this.trigger = props.name + 'Btn';
    this.style.width = 'fit-content';
  }

  toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  refBtn(btn) {
    if (!btn) return;
    if (this.bsDropdown) this.bsDropdown.dispose();
    this.bsDropdown = new Dropdown(btn, this.props.dropdown);
  }

  componentWillUnmount() {
    if (this.bsDropdown) this.bsDropdown.dispose();
  }

  dropdownRender(children) {
    const { menu, allowClose, itemClasses, dropdownClasses } = this.props;
    const cn = ['dropdown-menu', dropdownClasses].join(' ');
    return <div className={cn} style={{ minWidth: '100%' }}
      onClick={allowClose ? null : (e) => e.stopPropagation()} aria-labelledby={this.trigger}>
      {menu?.map((item, i) => {
        item.classes = item.classes || itemClasses;
        return item === 'divider' ?
          <div className="dropdown-divider" key={item.name || i} /> :
          (React.isValidElement(item) ?
            <React.Fragment key={item.name || i}>{item}</React.Fragment> :
            <DropdownItem {...item} key={item.name || i} />)
      })}
      {children}
    </div>
  }

  content(children = this.props.children) {
    const { btnClasses, label, value, disabled } = this.props;
    const cn = ['btn dropdown-toggle', btnClasses];
    return <>
      <button className={cn.join(' ')} type="button"
        ref={ref => this.refBtn(ref)}
        data-bs-toggle="dropdown"
        disabled={disabled} id={this.trigger}
        onClick={this.toggleDropdown}>
        {label || value}
      </button>
      {this.dropdownRender(children)}
    </>
  }
}