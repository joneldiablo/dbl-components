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
    navLink: true
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
  }

  componentDidMount() {
    if (this.props.toggle)
      eventHandler.subscribe(this.props.toggle, this.onToggleBtn.bind(this));
    this.unlisten = this.props.history.listen(this.onChangeRoute.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (typeof this.props.open === 'boolean' && prevProps.open !== this.props.open) {
      this.toggleText(this.props.open);
    }
  }

  componentWillUnmount() {
    console.log('ELIMINANDO!!!!!!');
    this.unlisten();
    if (this.collapses.current)
      Object.values(this.collapses.current).forEach(([ref, item, parentName, collapse]) => {
        console.log(ref, ref?.parentNode);
        item.submenuOpen = false;
        collapse.dispose();
        ref.removeEventListener('hidden.bs.collapse', this.hide);
      });
    this.collapses.current = {};
    if (this.props.toggle)
      eventHandler.unsubscribe(this.props.toggle);
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
      localClasses: open ? 'label-show' : 'label-collapsed'
    }, () => eventHandler.dispatch(this.props.name, this.state.open));
  }

  hide(e) {
    console.log('ESCONDIENDO', e.target, e.target.id);
    const itemName = e.target.id.split('-collapse')[0];
    this.collapses.current[itemName][1].submenuOpen = false;
    this.state.carets[itemName] = this.props.caretIcons[0];
    this.setState({ carets: this.state.carets });
    console.log('ESCONDIENDO');
  }

  collapseRef(ref, item, parentName) {
    console.log('___ENCONTRANDO REF', ref, item, parentName);
    if (ref) {
      const opts = { autoClose: false };
      const collapse = new Collapse(ref, opts);
      console.log('AGREGAR!!!!', collapse);
      if (!this.collapses.current) this.collapses.current = {};
      this.collapses.current[item.name] = [ref, item, parentName, collapse];
      this.state.carets[item.name] = this.props.caretIcons[0];
      ref.addEventListener('hidden.bs.collapse', this.hide.bind(this));
    } else if (this.collapses.current[item.name]) {
      const [ref, item, parentName, collapse] = this.collapses.current[item.name];
      collapse.dispose();
      delete this.collapses.current[item.name];
    }
  }

  onToggleSubmenu(e, item) {
    e.nativeEvent.stopPropagation();
    e.nativeEvent.preventDefault();
    if (!item.submenuOpen) {
      item.submenuOpen = true;
      this.state.carets[item.name] = this.props.caretIcons[1];
      this.setState({ carets: this.state.carets }, () => this.collapses.current[item.name][3].show());
    } else {
      this.collapses.current[item.name][3].hide();
    }
  }

  onNavigate(e, item) {
    this.activeItem = item;
    item.active = true;
  }

  link = (item, i, parentName) => {
    console.log('ITEMS!!!!', item);
    const { caretIcons, linkClasses, navLink } = this.props;
    const { carets, open } = this.state;
    carets[item.name] = carets[item.name] || caretIcons[0];

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
          {open && <>
            <span className="label">{this.jsonRender.buildContent(item.label)}</span>
            {!!item.menu?.length &&
              <span className="float-end caret-icon">
                <Icons icon={carets[item.name]} {...iconStyle} />
              </span>}
          </>}
        </>
      }
    </span>
    const propsLink = item.path ? {
      to: item.path,
      id: item.name + '-link',
      className: (() => {
        const r = [linkClasses, item.classes];
        if (navLink) r.unshift('nav-link');
        if (!!item.menu?.length) r.push('has-submenu');
        return r;
      })().join(' '),
      activeClassName: 'active',
      strict: item.strict,
      exact: item.exact,
      onClick: (e) => [!!item.menu?.length && this.onToggleSubmenu(e, item), this.onNavigate(e, item)]
    } : {
      id: item.name + '-link',
      className: (() => {
        const r = [linkClasses, item.classes, 'cursor-pointer'];
        if (navLink) r.unshift('nav-link');
        if (!!item.menu?.length) r.push('has-submenu');
        return r;
      })().join(' '),
      onClick: !!item.menu?.length ? (e) => this.onToggleSubmenu(e, item) : null
    }

    return (<React.Fragment key={i + '-' + item.path}>
      <div {...(item.itemProps || {})}>
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
          !!item.menu?.length &&
          <div ref={(ref) => this.collapseRef(ref, item, parentName)} id={item.name + '-collapse'} className="collapse">
            {
              //renderear solo cuando este abierto
              this.state.carets[item.name] === this.props.caretIcons[1] &&
              item.menu.map((m, i) => this.link(m, i, item.name + '-collapse'))
            }
          </div>
        }
      </div >
    </React.Fragment >);
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    return (<>
      {this.props.menu.map((m, i) => this.link(m, i, this.props.name))}
      {children}
    </>);
  }

}
