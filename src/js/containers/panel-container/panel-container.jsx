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
    classes: 'bg-light',
    routesIn: 'panelContent',
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
      onMouseLeave: this.onMouseLeave
    }
    const contentPanel = this.props.menu?.map(this.itemBuild);
    Object.assign(this.state, {
      logo: { _props: { src: this.props.icon, width: this.props.iconSize } },
      open: false,
      panelMenu: {
        active: !!this.props.menu,
        content: contentPanel
      },
      logoLink: { to: this.props.link || '/' },
      classSet: new Set(['close']),
      containersContentCol: {
        active: false
      }
    });
    if (this.props.type === 'reveal')
      this.state.classSet.add('inset');
  }

  componentDidMount() {
    super.componentDidMount();
    this.events.forEach(e => eventHandler.subscribe(...e));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName));
  }

  onMouseEnter = (e) => {
    this.state.classSet.add('open');
    this.state.classSet.delete('close');
    this.state.logo._props.src = this.props.logo;
    this.state.logo._props.width = this.props.width;
    this.state.open = true;
    this.forceUpdate();
  }

  onMouseLeave = (e) => {
    this.state.classSet.delete('open');
    this.state.classSet.add('close');
    this.state.logo._props.src = this.props.icon;
    this.state.logo._props.width = this.props.iconSize;
    this.state.open = false;
    this.forceUpdate();
  }

  mutations(sectionName) {
    if (sectionName.match(/ContentCol$|Submenu$|ContentExtra$/)) {
      return { active: this.state.open };
    }
    return this.state[sectionName];
  }

  itemBuild = (raw, i) => {
    const { label, icon, to,
      exact, activeClassName,
      content: contentExtra, menu, ...rest } = raw;
    const itemWrapper = deepMerge({}, listItem, rest);
    const mutation = (sectionName, section) => {
      switch (sectionName) {
        case 'item':
          return { name: raw.name };
        case 'itemIconCol':
          if (typeof icon === 'object')
            section.content = { itemIcon: icon };
          return {
            active: !!icon,
            name: itemWrapper.name + 'IconCol',
            to: to,
            exact: exact,
            activeClassName: activeClassName
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
          return {
            name: itemWrapper.name + 'Label',
            to: to,
            exact: exact,
            activeClassName: activeClassName,
            content: label
          }
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

  content(children = this.props.children) {
    this.classes = Array.from(this.state.classSet).join(' ');
    const { routesIn, view } = this.props;
    return <>
      {this.jsonRender.buildContent(view)}
      {!routesIn && children}
    </>
  }

}