import React from "react";
import { NavLink } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse";
import parseReact from "html-react-parser";

import eventHandler from "../functions/event-handler";
import Component from "../component";
import Icons from "../media/icons";
import Action from "../actions/action";

export class ToggleTextNavigation extends Action {

  static jsClass = 'ToggleTextNavigation';

  content() {
    return <Icons icon={this.props.icon} />
  }
}

export default class Navigation extends Component {

  static jsClass = 'Navigation';
  static defaultProps = {
    ...Component.defaultProps,
    menu: [],
    caretIcons: ['angle-up', 'angle-down']
  }

  tag = 'nav';

  constructor(props) {
    super(props);
    this.state.localClasses = 'nav';
    this.state.carets = {};
    this.state.open = true;
    this.state.localClasses = 'label-show';
    this.collapses = {};
  }

  componentDidMount() {
    eventHandler.subscribe(this.props.toggle, this.toggleText);
    Object.values(this.collapses).forEach(([ref, item, parentName, collapse]) => {
      ref.addEventListener('hide.bs.collapse', this.hide);
      ref.addEventListener('show.bs.collapse', this.show);
    });
  }

  componentWillUnmount() {
    Object.values(this.collapses).forEach(([ref, item, parentName, collapse]) => {
      collapse.dispose();
      ref.removeEventListener('hide.bs.collapse', this.hide);
      ref.removeEventListener('show.bs.collapse', this.show);
    });
    this.collapses = {};
    eventHandler.unsubscribe(this.props.toggle);
  }

  toggleText = () => {
    this.setState({
      open: !this.state.open,
      // INFO: invertido, el nuevo estado será false
      localClasses: this.state.open ? 'label-collapsed' : 'label-show'
    }, () => eventHandler.dispatch(this.props.name, this.state.open));
  }

  hide = (e) => {
    const itemName = e.target.id.split('-collapse')[0];
    this.setState({ carets: Object.assign(this.state.carets, { [itemName]: this.props.caretIcons[0] }) });
  }

  show = (e) => {
    const itemName = e.target.id.split('-collapse')[0];
    this.setState({ carets: Object.assign(this.state.carets, { [itemName]: this.props.caretIcons[1] }) });
  }

  collapseRef = (ref, item, parentName) => {
    if (ref) {
      const opts = { toggle: false };
      if (!parentName) opts.parent = this.ref.current;
      else if (this.collapses[parentName]) opts.parent = this.collapses[parentName][0];
      this.collapses[item.name] = [ref, item, parentName, Collapse.getOrCreateInstance(ref, opts)];
    }
  }

  onToggleSubmenu = (e, item) => {
    this.collapses[item.name][3].toggle();
  }

  link = (item, i, parentName) => {
    const { caretIcons, linkClasses } = this.props;
    const { carets, open } = this.state;
    carets[item.name] = carets[item.name] || caretIcons[0];

    const iconStyle = {
      style: {
        fill: 'currentColor'
      }
    };
    const innerNode = <span>
      {item.content ? parseReact(open ? item.content[0] : item.content[1]) :
        <>
          <Icons icon={item.icon} className="mx-2" {...iconStyle} />
          {open && <>
            <span className="label">{item.label}</span>
            {!!item.menu?.length &&
              <span className="float-end caret-icon">
                <Icons icon={carets[item.name]} {...iconStyle} />
              </span>}
          </>}
        </>
      }
    </span>
    const propsLink = {
      to: item.path,
      id: item.name + '-link',
      className: ['nav-link', linkClasses, item.classes].join(' '),
      activeClassName: 'active',
      strict: item.strict,
      exact: item.exact
    }
    return (<React.Fragment key={i + '-' + item.path}>
      <div onClick={!!item.menu?.length ? (e) => this.onToggleSubmenu(e, item) : null}>
        {item.path ?
          <NavLink {...propsLink} >
            {innerNode}
          </NavLink> :
          <span id={item.name + '-link'}
            className={[propsLink.className, 'cursor-pointer'].join(' ')}
          >{innerNode}
          </span>
        }
        {!!item.menu?.length &&
          <div ref={(ref) => this.collapseRef(ref, item, parentName)} id={item.name + '-collapse'} className="collapse">
            {item.menu.map((m, i) => this.link(m, i, item.name))}
          </div>}
      </div>
    </React.Fragment>);
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    return (<>
      {this.props.menu.map((m, i) => this.link(m, i))}
      {children}
    </>);
  }

}
