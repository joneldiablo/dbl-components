import React from "react";

import deepMerge, { mergeWithMutation } from "../../functions/deep-merge";
import eventHandler from "../../functions/event-handler";
import JsonRender from "../../json-render";
import Container from "../container";
import panelView from "./panel-view.json";
import listItem from "./list-item.json";

export default class PanelContainer extends Container {

  static jsClass = 'PanelContainer';
  static wrapper = 'aside';

  static defaultProps = {
    ...Container.defaultProps,
    view: panelView,
    classes: '',
    itemClasses: '',
    routesIn: 'panelContent',
    open: true,
    fixed: false,
    type: 'push',
    iconSize: 50,
    width: 200
  }

  constructor(props) {
    super(props);
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
    this.events = [
      ['update.' + this.props.name, this.onUpdate]
    ];
    this.eventHandlers = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd
    }

    Object.assign(this.state, {
      logo: { _props: { src: this.props.icon, width: this.props.iconSize } },
      expanded: false,
      logoLink: { to: this.props.link || '/' },
      classSet: new Set(['close']),
      containersContentCol: {
        active: false
      },
      open: props.open,
      fixed: props.fixed
    });
    if (this.props.type === 'reveal')
      this.state.classSet.add('inset');
  }

  componentDidMount() {
    super.componentDidMount();
    const contentPanel = this.props.menu?.map(this.itemBuild);
    this.setState({
      panelMenu: {
        active: !!this.props.menu,
        content: contentPanel
      }
    });
    this.events.forEach(e => eventHandler.subscribe(...e));
    this.onWindowResize({ target: window });
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName));
    window.removeEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);
    if (prevProps.fixed != this.props.fixed) {
      if (this.props.fixed) this.onMouseEnter();
      else this.onMouseLeave();
      this.setState({ fixed: this.props.fixed });
    }
    if (prevProps.open != this.props.open) {
      if (this.props.open) this.onMouseEnter();
      this.setState({ open: this.props.open });
    }
  }

  onMouseEnter = (e) => {
    if (!e?.force && (this.state.mobile || this.state.fixed)) return;
    this.state.classSet.add('expanded');
    this.state.classSet.delete('close');
    this.state.logo._props.src = this.props.logo;
    this.state.logo._props.width = this.props.width;
    this.state.expanded = true;
    this.forceUpdate();
  }

  onMouseLeave = (e) => {
    if (!e?.force && (this.state.mobile || this.state.fixed)) return;
    this.state.classSet.delete('expanded');
    this.state.classSet.add('close');
    this.state.logo._props.src = this.props.icon;
    this.state.logo._props.width = this.props.iconSize;
    this.state.expanded = false;
    this.forceUpdate();
  }

  onWindowResize = (e) => {
    const mobile = e.target.innerWidth < this.props.breakpoints.sm;
    if (mobile) {
      this.onMouseEnter();
      this.state.classSet.add('mobile');
      this.state.classSet.delete('inset');
    } else {
      this.onMouseLeave({ force: true });
      this.state.classSet.delete('mobile');
      if (this.props.type === 'reveal')
        this.state.classSet.add('inset');
    }
    this.setState({ mobile, open: !mobile });
  }

  onUpdate = (update) => {
    if (typeof update.open !== 'undefined') {
      this.setState({ open: update.open });
    }
    if (typeof update.fixed !== 'undefined') {
      if (update.fixed) this.onMouseEnter();
      else this.onMouseLeave({ force: true });
      this.setState({ fixed: update.fixed });
    }
  }

  onTouchStart = e => {
    this.touchstartX = e.changedTouches[0].screenX;
  }

  onTouchEnd = e => {
    this.touchendX = e.changedTouches[0].screenX;
    const diff = Math.abs(this.touchendX - this.touchstartX);
    if (diff < 18) return;
    const action = this.state.mobile ? 'open' : 'fixed';
    if (this.touchendX < this.touchstartX) {
      this.onUpdate({ [action]: false });
    }
    if (this.touchendX > this.touchstartX) {
      this.onUpdate({ [action]: true });
    }
  }

  itemBuild = (raw, i) => {
    const { label, icon, to, classes,
      exact, activeClassName, menu,
      content: contentExtra, ...rest } = raw;
    const itemWrapper = deepMerge({}, listItem, rest);
    const mutation = (sectionName, section) => {
      switch (sectionName) {
        case 'item':
          return {
            name: raw.name,
            classes: (this.props.itemClasses || classes)
          };
        case 'itemIconRow':
          if (typeof icon === 'object')
            section.content = { itemIcon: icon };
          return {
            active: !!icon,
            name: itemWrapper.name + 'IconRow',
            to: to,
            exact: exact,
            activeClassName
          }
        case 'itemIcon':
          return {
            icon: icon,
            name: itemWrapper.name + 'Icon',
            style: {
              width: this.props.iconSize,
              height: this.props.iconSize
            }
          }
        case 'itemContentCol':
          return { name: itemWrapper.name + 'ContentCol' }
        case 'itemLabel':
          return { name: itemWrapper.name + 'Label', content: label }
        case 'itemContentExtra':
          return {
            active: !!contentExtra,
            name: itemWrapper.name + 'ContentExtra',
            content: contentExtra,
            style: {
              paddingLeft: !!icon &&
                `calc(${this.props.iconSize}px + .5rem)`
            }
          };
        default:
          break;
      }
      return false;
    }
    mergeWithMutation(itemWrapper, mutation, ['style', 'menu', 'itemSubmenu']);
    itemWrapper.name = raw.name + 'Wrapper';
    //INFO: por alguna razón se putea con "maximun call stack" cuando mando llamar 
    //      los submenus dentro de mutation, por eso los he tenido que sacar
    if (menu) {
      const subMenu = menu.map(this.itemBuild);
      itemWrapper.content.itemSubmenu = {
        name: itemWrapper.name + 'Submenu',
        component: 'ListContainer',
        classes: 'list-unstyled col w-100',
        content: subMenu,
        style: {
          paddingLeft: !!icon &&
            `calc(${this.props.iconSize}px + .5rem)`
        }
      }
    } else delete itemWrapper.content.itemSubmenu;
    return itemWrapper;
  }

  mutations(sectionName) {
    if (sectionName.match(/ContentCol$|Submenu$|ContentExtra$/)) {
      return { active: this.state.mobile || this.state.fixed || this.state.expanded };
    }
    if (sectionName.endsWith('IconRow')) {
      const classes = 'row gx-2 align-items-center text-decoration-none' +
        (this.state.expanded ? '' : ' justify-content-center');
      return { classes }
    }
    return this.state[sectionName];
  }

  content(children = this.props.children) {
    this.classes = Array.from(this.state.classSet).join(' ');
    const { routesIn, view } = this.props;
    return <>
      {this.jsonRender.buildContent(view)}
      {!routesIn && children}
    </>
  }

  render() {
    return this.state.open ? super.render() : <div ref={this.ref} />;
  }

}