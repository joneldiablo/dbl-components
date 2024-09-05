import React, { createRef } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';
import Collapse from "bootstrap/js/dist/collapse";

import eventHandler from "../functions/event-handler";
import deepMerge from "../functions/deep-merge";
import Icons from "../media/icons";
import Action from "../actions/action";
import JsonRender from "../json-render";
import Component from "../component";

const itemPropTypes = {
  active: PropTypes.bool,
  classes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.element,
  ]),
  disabled: PropTypes.bool,
  exact: PropTypes.bool,
  hasAnActive: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.string,
  iconProps: PropTypes.object,
  itemClasses: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  itemProps: PropTypes.object,
  label: PropTypes.string.isRequired,
  menu: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  name: PropTypes.string.isRequired,
  parent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  path: PropTypes.string,
  strict: PropTypes.bool,
  to: PropTypes.string
};

export class ToggleTextNavigation extends Action {

  static jsClass = 'ToggleTextNavigation';

  content() {
    return React.createElement(Icons, { icon: this.props.icon });
  }
}

export default class Navigation extends Component {

  static jsClass = 'Navigation';
  static defaultProps = {
    ...Component.defaultProps,
    menu: [],
    caretIcons: ['angle-up', 'angle-down'],
    navLink: true,
    activeClasses: 'active',
    inactiveClasses: '',
    pendingClasses: 'pending',
    transitioningClasses: 'transitioning',
    itemTag: 'div',
    itemClasses: ''
  }

  tag = 'nav';
  events = [];

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      carets: {},
      open: typeof this.props.open !== 'boolean' || this.props.open,
      localClasses: 'nav label-show'
    });

    this.collapses = createRef({});
    this.jsonRender = new JsonRender(props);
    this.hide = this.hide.bind(this);
    this.link = this.link.bind(this);
    this.onToggleBtn = this.onToggleBtn.bind(this);

    // Agrega el evento solo si existe el prop `toggle`
    if (this.props.toggle) {
      this.events.push([this.props.toggle, this.onToggleBtn]);
    }
  }

  componentDidMount() {
    this.findFirstActive(this.props.menu);
    // Suscribimos a todos los eventos almacenados en `this.events`
    this.events.forEach(evt => eventHandler.subscribe(...evt, this.name));
  }

  componentDidUpdate(prevProps) {
    // Verificar si `open` cambió y actualizar
    if (typeof this.props.open === 'boolean' && prevProps.open !== this.props.open) {
      this.toggleText(this.props.open);
    }

    // Manejo de cambio en `toggle`
    if (this.props.toggle && prevProps.toggle !== this.props.toggle) {
      // Desuscribimos del evento anterior solo si existía
      if (prevProps.toggle) {
        eventHandler.unsubscribe(prevProps.toggle, this.name);
      }

      // Actualizar el array de eventos con el nuevo toggle
      const i = this.events.findIndex(([evtName]) => evtName === prevProps.toggle);
      if (i !== -1) {
        this.events.splice(i, 1); // Eliminamos el evento anterior
      }

      // Evitamos duplicar eventos
      if (!this.events.some(([evtName]) => evtName === this.props.toggle)) {
        this.events.push([this.props.toggle, this.onToggleBtn]); // Añadir el nuevo evento
        eventHandler.subscribe(this.props.toggle, this.onToggleBtn, this.name); // Suscribir
      }
    }
  }

  componentWillUnmount() {
    // Desuscribimos de todos los eventos cuando el componente se desmonta
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.name));
  }

  findFirstActive(menu, parent) {
    let founded;
    menu.find(item => {
      item.parent = parent;
      if (this.props.location.pathname === (item.path || item.to)) {
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
    eventHandler.dispatch(this.props.name, { pathname: this.pathname, item: this.activeItem });
  }

  onToggleBtn() {
    this.toggleText();
  }

  toggleText(open = !this.state.open) {
    this.setState({
      open,
      localClasses: open ? 'nav label-show' : 'nav label-collapsed'
    }, () => eventHandler.dispatch(this.props.name, { pathname: this.pathname, item: this.activeItem, open: this.state.open }));
  }

  collapseRef(ref, item) {
    if (!ref) return;
    if (!this.collapses.current) this.collapses.current = {};
    if (this.collapses.current[item.name]?.ref === ref) return;
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
      itemControl.collapse = Collapse.getOrCreateInstance(itemControl.ref, { autoClose: false, toggle: false });
      itemControl.ref.addEventListener('hidden.bs.collapse', this.hide);
    }
    if (!itemControl.submenuOpen) {
      this.state.carets[item.name] = this.props.caretIcons[0];
      this.setState({ carets: this.state.carets }, () => itemControl.collapse.show());
    } else {
      //Se usa en event hide para ocultar todo
      Array.from(itemControl.ref.querySelectorAll('.collapse'))
        .reverse().forEach(c => Collapse.getInstance(c)?.hide());
      itemControl.collapse.hide();
    }
    itemControl.submenuOpen = !itemControl.submenuOpen;
  }

  hide(e) {
    const itemName = e.target.id.split('-collapse')[0];
    const itemControl = this.collapses.current[itemName];
    const caretClose = this.props.caretIcons[1];
    itemControl.submenuOpen = false;
    this.state.carets[itemName] = caretClose;

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

  link(itemRaw, i, parent) {
    if (!itemRaw) return false;

    const { caretIcons, linkClasses, navLink, itemTag,
      activeClasses, inactiveClasses, pendingClasses, transitioningClasses,
    } = this.props;
    const { carets, open } = this.state;

    const modify = typeof this.props.mutations === 'function'
      && this.props.mutations(`${this.props.name}.${itemRaw.value}`, item);
    const item = Object.assign({}, itemRaw, modify || {});
    if (item.active === false) return false;

    carets[item.name] = carets[item.name] || caretIcons[1];
    this.flatItems.push(item);
    item.parent = parent;

    const iconStyle = {
      style: {
        fill: 'currentColor'
      }
    };
    const innerNode = React.createElement('span', {},
      item.content
        ? (open
          ? this.jsonRender.buildContent(item.content[0])
          : this.jsonRender.buildContent(item.content[1])
        )
        : React.createElement(React.Fragment, {},
          React.createElement(Icons,
            { icon: item.icon, className: "mx-2", ...iconStyle, ...deepMerge(this.props.iconProps || {}, item.iconProps || {}) }),
          open && React.createElement('span',
            { className: "label" },
            this.jsonRender.buildContent(item.label)
          )
        )
    )
    const disabled = item.disabled || this.props.disabled;
    const className = (() => {
      const r = [linkClasses, item.classes];
      if (!(item.path || item.to)) r.push('cursor-pointer');
      if (item.hasAnActive) r.push('has-an-active');
      if (navLink) r.unshift('nav-link');
      if (!!item.menu?.length) r.push('has-submenu');
      if (disabled) r.push('disabled');
      return r;
    })().flat().join(' ');
    const propsLink = (item.path || item.to)
      ? {
        id: item.name + '-link', className,
        onClick: !disabled ? ((e) => [
          !!item.menu?.length && this.onToggleSubmenu(e, item),
          this.onNavigate(e, item)
        ]) : null,
        to: (item.path || item.to),
        className: ({ isActive, isPending, isTransitioning }) => [
          isActive ? activeClasses : inactiveClasses,
          isPending ? pendingClasses : "",
          isTransitioning ? transitioningClasses : "",
          className
        ].join(" "),
        strict: item.strict,
        exact: item.exact,
        disabled,
        style: {}
      }
      : (item.href
        ? {
          tag: 'a',
          name: item.name,
          id: item.name + '-link',
          classes: className,
          disabled,
          style: {},
          _props: {
            href: item.href, target: '_blank'
          },
          onClick: !disabled && !!item.menu?.length ? (e) => this.onToggleSubmenu(e, item) : null
        }
        : {
          tag: 'span',
          name: item.name,
          id: item.name + '-link',
          classes: className,
          onClick: !disabled && !!item.menu?.length ? (e) => this.onToggleSubmenu(e, item) : null,
          disabled,
          style: {}
        });

    const styleWrapCaret = {
    }
    if (!!item.menu?.length && open) {
      styleWrapCaret.position = "relative";
      propsLink.style.paddingRight = "2.3rem";
    }

    const itemProps = {
      ...(item.itemProps || {}),
      className: [item.itemClasses || this.props.itemClasses].flat().filter(Boolean).join(' ')
    }
    return React.createElement(itemTag, itemProps,
      React.createElement('div', { style: styleWrapCaret },
        (item.path || item.to)
          ? React.createElement(NavLink, propsLink, innerNode)
          : React.createElement(Component, propsLink, innerNode)
        ,
        !!item.menu?.length && open &&
        React.createElement('span',
          {
            className: "position-absolute top-50 end-0 translate-middle-y caret-icon p-1 cursor-pointer",
            onClick: e => this.onToggleSubmenu(e, item)
          },
          React.createElement(Icons,
            {
              icon: carets[item.name], ...iconStyle, inline: false,
              style: {
                width: "1.8rem", padding: '.5rem'
              }, className: "rounded-circle"
            }
          )
        )
      ),
      !!item.menu?.length &&
      React.createElement('div',
        {
          ref: (ref) => this.collapseRef(ref, item),
          id: item.name + '-collapse', className: "collapse"
        },
        //renderear solo cuando este abierto
        this.state.carets[item.name] === this.props.caretIcons[0] &&
        item.menu.map((m, i) => this.link(m, i, item)).filter(m => !!m)
      )
    );
  }

  // TODO: agregar submenu dropdown 
  //       y submenu collapsable
  content(children = this.props.children) {
    this.flatItems = [];
    return (React.createElement(React.Fragment, {},
      ...this.props.menu.map((m, i) => this.link(m, i)).filter(m => !!m),
      children
    ));
  }

}
