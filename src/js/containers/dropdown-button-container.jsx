import React from "react";
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

  constructor(props) {
    super(props);
    this.state.localClasses = 'dropdown';
    this.style.width = 'fit-content';
  }

  onClick = (value) => {
    const { onClick, name } = this.props;
    if (typeof onClick === 'function') onClick({ [name]: value });
    else eventHandler.dispatch(name, value);
  }

  content(children = this.props.children) {
    const { btnClasses, label, menu, allowClose, disabled } = this.props;
    const cn = ['btn dropdown-toggle', btnClasses];
    return <>
      <button className={cn.join(' ')} type="button" data-bs-toggle="dropdown" disabled={disabled}>
        {label}
      </button>
      <div className="dropdown-menu" style={{ minWidth: '100%' }}
        onClick={allowClose ? null : (e) => e.stopPropagation()}>
        {menu && menu.map(item => item !== 'divider' ?
          <DropdownItem value={item.value} onClick={this.onClick}>{item.label}</DropdownItem> :
          <div className="dropdown-divider" />
        )}
        {children}
      </div>
    </>
  }
}