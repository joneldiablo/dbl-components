import React from "react";

import deepMerge, { mergeWithMutation } from "../../functions/deep-merge";
import eventHandler from "../../functions/event-handler";
import JsonRender from "../../json-render";
import Component from "../../component";
import panelView from "./panel-view.json";
import listItem from "./list-item.json";

export default class PanelContainer extends Component {

  static jsClass = 'PanelContainer';
  static wrapper = 'aside';

  static defaultProps = {
    ...Component.defaultProps,
    breakpoint: 540,
    classes: 'px-1',
    fixed: false,
    iconSize: 50,
    itemClasses: '',
    open: true,
    type: 'push',
    view: panelView,
    width: 200
  }

  constructor(props) {
    super(props);
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
    this.events = [
      ['update.' + props.name, this.onUpdate]
    ];
    this.eventHandlers = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd
    }

    Object.assign(this.state, {
      logo: { _props: { src: props.icon, width: props.iconSize } },
      expanded: false,
      logoLink: { to: props.link || '/' },
      classSet: new Set(['close']),
      containersContentCol: {
        active: false
      },
      open: props.open,
      fixed: props.fixed,
      localClasses: 'position-relative'
    });
    if (props.type === 'reveal')
      this.state.classSet.add('inset');

  }

  componentDidMount() {
    const contentPanel = this.props.menu?.map(this.itemBuild);
    this.setState({
      panelMenu: {
        active: !!this.props.menu,
        content: contentPanel
      }
    });
    this.events.forEach(e => eventHandler.subscribe(...e));
    window.addEventListener('resize', this.onWindowResize);
    this.historyUnlisten = this.props.history.listen(this.onChangeLocation);
    setTimeout(() => this.onWindowResize({ target: window }), 150);
  }

  componentWillUnmount() {
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName));
    this.historyUnlisten();
    window.removeEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
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
    const mobile = e.target.innerWidth < this.props.breakpoint;
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
    this.onUpdate({ mobile, open: !mobile }, true);
  }

  onUpdate = (update, dispatch) => {
    const newState = {};
    if (typeof update.mobile !== 'undefined') {
      newState.mobile = update.mobile;
    }
    if (typeof update.open !== 'undefined') {
      newState.open = update.open;
    }
    if (typeof update.fixed !== 'undefined') {
      if (update.fixed) this.onMouseEnter();
      else this.onMouseLeave({ force: true });
      newState.fixed = update.fixed;
    }
    this.setState(newState);
    if (dispatch) {
      eventHandler.dispatch(this.props.name, { [this.props.name]: update });
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
      this.onUpdate({ [action]: false }, true);
    }
    if (this.touchendX > this.touchstartX) {
      this.onUpdate({ [action]: true }, true);
    }
  }

  onNavigate = (e) => {
    console.log(e);
  }

  onChangeLocation = () => {
    if (this.state.mobile && this.state.open) {
      this.onUpdate({ open: false }, true);
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
        case 'badge':
          return {
            name: itemWrapper.name + 'Badge',
            content: itemWrapper.value,
            active: !!itemWrapper.value
          }
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
      return { classes };
    }
    return this.state[sectionName];
  }

  content(children = this.props.children) {
    this.classes = Array.from(this.state.classSet).join(' ');
    const { view } = this.props;
    return <>
      {this.jsonRender.buildContent(view)}
      {children}
    </>
  }

  render() {
    return this.state.open ?
      <>
        {this.state.mobile && <div className="panel-touchClose"
          onClick={() => this.onUpdate({ open: false }, true)} />}
        {super.render()}
      </> :
      <div className="panel-slide2open" ref={this.ref}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
      />;
  }

}