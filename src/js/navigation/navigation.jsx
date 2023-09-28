import React, { createRef } from "react";
import { NavLink } from "react-router-dom";
import Collapse from "bootstrap/js/dist/collapse";
import parseReact from "html-react-parser";

import eventHandler from "../functions/event-handler";
import JsonRender from "../json-render";
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
    caretIcons: ['angle-up', 'angle-down'],
    navLink: true,
    activeClassName: 'active'
  }

  tag = 'nav';

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      carets: {},
      open: typeof this.props.open !== 'boolean' || this.props.open,
      localClasses: 'nav label-show'
    })
    this.collapses = createRef({});
    this.jsonRender = new JsonRender(props);
    this.hide = this.hide.bind(this);
  }

  componentDidMount() {
    if (this.props.toggle)
      eventHandler.subscribe(this.props.toggle, this.onToggleBtn.bind(this));
    this.unlisten = this.props.history.listen(this.onChangeRoute.bind(this));
    this.findFirstActive(this.props.menu);
  }

  componentDidUpdate(prevProps, prevState) {
    if (typeof this.props.open === 'boolean' && prevProps.open !== this.props.open) {
      this.toggleText(this.props.open);
    }
  }

  componentWillUnmount() {
    if (this.props.toggle)
      eventHandler.unsubscribe(this.props.toggle);
    this.unlisten();
    if (this.collapses.current)
      Object.entries(this.collapses.current).forEach(([key, itemControl]) => {
        itemControl.submenuOpen = false;
        itemControl.collapse?.dispose();
        itemControl.ref.removeEventListener('hidden.bs.collapse', this.hide);
        delete this.collapses.current[key];
      });
    this.collapses.current = {};

  }

  findFirstActive(menu, parent) {
    let founded;
    menu.find(item => {
      item.parent = parent;
      if (this.props.location.pathname === item.path) {
        this.onNavigate(null, item);
        this.onChangeRoute(this.props.location);
        founded = item;
        return true;
      } else if (item.menu) {
        founded = this.findFirstActive(item.menu, item);
        return !!founded;
      }
      return false;
    });
    return founded;
  }

  onChangeRoute(location, action) {
    this.pathname = location.pathname;
    eventHandler.dispatch(this.name, { pathname: this.pathname, item: this.activeItem });
  }

  onToggleBtn() {
    this.toggleText();
  }

  toggleText(open = !this.state.open) {
    this.setState({
      open,
      localClasses: open ? 'nav label-show' : 'nav label-collapsed'
    }, () => eventHandler.dispatch(this.name, { pathname: this.pathname, item: this.activeItem, open: this.state.open }));
  }

  collapseRef(ref, item) {
    if (!ref) return;
    if (!this.collapses.current) this.collapses.current = {};
    if (this.collapses.current[item.name]) return;
    this.collapses.current[item.name] = {
      ref,
      item,
      submenuOpen: false
    }

  }

  onToggleSubmenu(e, item) {
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.preventDefault();
    const itemControl = this.collapses.current[item.name];
    if (!itemControl.collapse) {
      itemControl.ref.removeEventListener('hidden.bs.collapse', this.hide);
      itemControl.collapse = Collapse.getOrCreateInstance(itemControl.ref, { autoClose: false });
      itemControl.ref.addEventListener('hidden.bs.collapse', this.hide);
    }
    if (!itemControl.submenuOpen) {
      itemControl.submenuOpen = true;
      this.state.carets[item.name] = this.props.caretIcons[0];
      this.setState({ carets: this.state.carets }, () => itemControl.collapse.show());
    } else {
      //Se oculta todo en el evento de ocultar
      itemControl.collapse.hide();
    }
  }

  hide(e) {
    const itemName = e.target.id.split('-collapse')[0];
    const itemControl = this.collapses.current[itemName];
    itemControl.submenuOpen = false;
    this.state.carets[itemName] = this.props.caretIcons[1];
    this.setState({ carets: this.state.carets });
  }

  hasAnActive(menuItem) {
    if (!menuItem.parent) return menuItem.name;
    menuItem.parent.hasAnActive = true;
    return this.hasAnActive(menuItem.parent);
  }

  onNavigate(e, activeItem) {
    this.activeItem = activeItem;
    this.flatItems.forEach(i => {
      i.active = false;
      i.hasAnActive = false;
    });
    activeItem.active = true;
    this.hasAnActive(activeItem);
  }

  link = (item, i, parent) => {
    const { caretIcons, linkClasses, navLink, activeClassName } = this.props;
    const { carets, open } = this.state;
    carets[item.name] = carets[item.name] || caretIcons[1];
    this.flatItems.push(item);
    item.parent = parent;

    const iconStyle = {
      style: {
        fill: 'currentColor'
      }
    };
    const innerNode = <span>
      {item.content
        ? (open
          ? this.jsonRender.buildContent(item.content[0])
          : this.jsonRender.buildContent(item.content[1])
        )
        : <>
          <Icons icon={item.icon} className="mx-2" {...iconStyle} {...(item.iconProps || {})} />
          {open && <span className="label">{this.jsonRender.buildContent(item.label)}</span>}
        </>
      }
    </span>
    const className = (() => {
      const r = [linkClasses, item.classes];
      if (!item.path) r.push('cursor-pointer');
      if (item.hasAnActive) r.push('has-an-active');
      if (navLink) r.unshift('nav-link');
      if (!!item.menu?.length) r.push('has-submenu');
      return r;
    })().join(' ');
    const propsLink = item.path ? {
      id: item.name + '-link', className,
      onClick: (e) => [!!item.menu?.length && this.onToggleSubmenu(e, item), this.onNavigate(e, item)],
      to: item.path,
      activeClassName,
      strict: item.strict,
      exact: item.exact,
      style: {}
    } : {
      id: item.name + '-link', className,
      onClick: !!item.menu?.length ? (e) => this.onToggleSubmenu(e, item) : null,
      style: {}
    }

    styleWrapCaret = {
    }
    if (!!item.menu?.length && open) {
      styleWrapCaret.position = "relative";
      propsLink.style.paddingRight = "2.3rem";
    }

    return (<React.Fragment key={i + '-' + item.path}>
      <div {...(item.itemProps || {})} >
        <div style={styleWrapCaret}>
          {
            item.path ?
              <NavLink {...propsLink}>
                {innerNode}
              </NavLink>
              : <span {...propsLink} >
                {innerNode}
              </span >
          }
          {
            !!item.menu?.length && open &&
            <span
              className="position-absolute top-50 end-0 translate-middle-y caret-icon p-1 cursor-pointer"
              onClick={e => this.onToggleSubmenu(e, item)}>
              <Icons icon={carets[item.name]} {...iconStyle} inline={false} style={{
                width: "1.8rem", padding: '.5rem'
              }} className="rounded-circle" />
            </span>
          }
        </div>
        {
          !!item.menu?.length &&
          <div ref={(ref) => this.collapseRef(ref, item)} id={item.name + '-collapse'} className="collapse">
            {
              //renderear solo cuando este abierto
              this.state.carets[item.name] === this.props.caretIcons[0] &&
              item.menu.map((m, i) => this.link(m, i, item))
            }
          </div>
        }
      </div>
    </React.Fragment>);
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    this.flatItems = [];
    return (<>
      {this.props.menu.map((m, i) => this.link(m, i, this.props.name))}
      {children}
    </>);
  }

}
