import React, { createRef } from "react";
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
    else if (typeof props.href === 'string') this.tag = 'a';
    else this.tag = 'button';
    this.eventHandlers = {
      onClick: this.onClick
    }
  }

  onClick = (e) => {
    eventHandler.dispatch(this.props.name, { [this.props.name]: { value: this.props.value } });
  }

  get componentProps() {
    if (this.tag === NavLink || this.tag === 'a') {
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
        _component,
        href,
        target
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
        component: _component,
        href,
        target
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
    this.btn = createRef();
    this.trigger = props.name + 'Btn';
    this.style.width = 'fit-content';
    this.onBsEvents = this.onBsEvents.bind(this);
    this.events = [
      ['update.' + props.name, this.onUpdate.bind(this)]
    ];
    Object.assign(this.state, {
      open: false
    });
  }

  componentDidMount() {
    this.events.forEach(e => eventHandler.subscribe(...e));
    if (this.btn.current) {
      const btn = this.btn.current;
      this.bsDropdown = Dropdown.getOrCreateInstance(btn, this.props.dropdown);
      btn.removeEventListener('hide.bs.dropdown', this.onBsEvents);
      btn.removeEventListener('hidden.bs.dropdown', this.onBsEvents);
      btn.removeEventListener('show.bs.dropdown', this.onBsEvents);
      btn.removeEventListener('shown.bs.dropdown', this.onBsEvents);

      btn.addEventListener('hide.bs.dropdown', this.onBsEvents);
      btn.addEventListener('hidden.bs.dropdown', this.onBsEvents);
      btn.addEventListener('show.bs.dropdown', this.onBsEvents);
      btn.addEventListener('shown.bs.dropdown', this.onBsEvents);
    }
  }

  componentWillUnmount() {
    this.events.forEach(e => eventHandler.unsubscribe(e[0]));
    if (this.bsDropdown) {
      this.bsDropdown.dispose();
      this.bsDropdown = false;
    }
    if (this.btn.current) {
      const btn = this.btn.current;
      btn.removeEventListener('hide.bs.dropdown', this.onBsEvents);
      btn.removeEventListener('hidden.bs.dropdown', this.onBsEvents);
      btn.removeEventListener('show.bs.dropdown', this.onBsEvents);
      btn.removeEventListener('shown.bs.dropdown', this.onBsEvents);
    }
  }

  onUpdate({ open }) {
    if (open !== undefined) this.bsDropdown[open ? 'show' : 'hide']();
  }

  onBsEvents(evt) {
    console.log('bs_event', evt);
    const evtType = evt.type.split('.')[0];
    eventHandler.dispatch(this.props.name, {
      [this.props.name]: {
        open: evt.type.includes('shown'),
        event: evtType,
        menu: this.props.menu
      }
    });
    if (evtType === 'show') {
      this.setState({ open: true });
    } else if (evtType === 'hidden') {
      this.setState({ open: false });
    }
  }

  dropdownRender(children) {
    const { menu, allowClose, itemClasses, dropdownClasses } = this.props;
    const cn = ['dropdown-menu', dropdownClasses].join(' ');
    return <div className={cn} style={{ minWidth: '100%' }}
      onClick={allowClose ? null : (e) => e.stopPropagation()} aria-labelledby={this.trigger}>
      {this.state.open &&
        menu?.map((item, i) => {
          if (item === 'divider')
            return <div className="dropdown-divider" key={item.name || i} />
          item.classes = item.classes || itemClasses;
          return (React.isValidElement(item) ?
            <React.Fragment key={item.name || i}>{item}</React.Fragment> :
            <DropdownItem {...item} key={item.name || i} />)
        })
      }
      {this.state.open && children}
    </div>
  }

  content(children = this.props.children) {
    const { btnClasses, label, value, disabled } = this.props;
    const cn = ['btn dropdown-toggle', btnClasses];
    return <>
      <button className={cn.join(' ')} type="button"
        ref={this.btn}
        data-bs-toggle="dropdown"
        disabled={disabled} id={this.trigger}
      >
        {label || value}
      </button>
      {this.dropdownRender(children)}
    </>
  }
}