import React from "react";
import PropTypes from "prop-types";

import { eventHandler } from "dbl-utils";
import Component, { nameSuffixes } from "../../complex-component";

import schema from "./panel-schema.json";

export default class PanelContainer extends Component {

  static propTypes = {
    ...Component.propTypes,
    breakpoint: PropTypes.string,
    contentTop: PropTypes.object,
    icon: PropTypes.string,
    iconSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    link: PropTypes.string,
    logo: PropTypes.string,
    type: PropTypes.oneOf(['push', 'reveal']),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static jsClass = 'PanelContainer';
  static defaultProps = {
    ...Component.defaultProps,
    schema,
    definitions: {},
    breakpoint: 540,
    iconSize: 30,
    type: 'push',
    width: 200,
    menu: [],
    classes: {
      '.': '',
      items: '',
    },
    rules: {
      ...nameSuffixes(["LogoLink", "LogoImg", "ContentTop",
        "PanelMenu", "ToggleFixed", "IconTF"]),
      '$itemName': ['join', '$item/name', 'Item'],
      '$subitemName': ['join', '$subItem/name', 'SubItem'],
      '$nameSubmenu': ['join', '$item/name', 'Submenu'],
      '$definitions/contentMenu': ['iterate', '$data/menu', 'item'],
      '$definitions/itemContentMenu': ['iterate', '$item/menu', 'item'],
      '$itemBadge': ['ignore', '$item/badge', null],
      "$submenu": ['if', '$item/menu', '$definitions/submenu', null]
    },
  }

  constructor(props) {
    super(props);
    this.events = [
      ['update.' + props.name, this.onUpdate],
      [props.name + 'ToggleFixed', this.onToggleFixed],
      ['location', this.onChangeLocation.bind(this)]
    ];
    this.eventHandlers = {
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd
    }

    Object.assign(this.state, {
      classSet: new Set(['close']),
      expanded: false,
      fixed: false,
      open: true,
      [props.name + 'LogoLink']: { to: props.link || '/' }
    });
    if (props.type === 'reveal')
      this.state.classSet.add('inset');
  }

  componentDidMount() {
    this.events.forEach(e => eventHandler.subscribe(...e));
    window.addEventListener('resize', this.onWindowResize);
    clearTimeout(this.timeoutResize);
    this.timeoutResize = setTimeout(() => this.onWindowResize({ target: window }), 150);
  }

  componentWillUnmount() {
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName));
    window.removeEventListener('resize', this.onWindowResize);
    clearTimeout(this.timeoutResize);
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

  onChangeLocation = () => {
    if (this.state.mobile && this.state.open) {
      this.onUpdate({ open: false }, true);
    }
  }

  onToggleFixed = (e) => {
    this.onUpdate({ fixed: !this.state.fixed }, true);
  }

  onMouseEnter = (e) => {
    if (!e?.force && (this.state.mobile || this.state.fixed)) return;
    this.state.classSet.add('expanded');
    this.state.classSet.delete('close');

    this.state.expanded = true;
    this.forceUpdate();
  }

  onMouseLeave = (e) => {
    if (!e?.force && (this.state.mobile || this.state.fixed)) return;
    this.state.classSet.delete('expanded');
    this.state.classSet.add('close');
    this.state.expanded = false;
    this.forceUpdate();
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

  mutations(sn, s) {
    const { name } = this.props;
    switch (sn) {
      case name + 'LogoImg':
        return this.state.expanded ? {
          classes: 'logo expanded',
          _props: { src: this.props.logo, width: this.props.width }
        } : {
          classes: 'logo',
          _props: { src: this.props.icon, width: this.props.iconSize }
        };
      case name + 'ContentTop':
        const active = !!this.props.contentTop;
        const content = active ? this.jsonRender.buildContent(this.props.contentTop) : null;
        return { active, content };
      case name + 'IconTF':
        return {
          icon: this.state.fixed ? 'expand-unlocked' : 'expand-locked',
          label: this.state.fixed ? 'Permitir cerrar' : 'Mantener abierto',
          activeLabel: this.state.expanded,
          iconSize: this.props.iconSize
        };
      case name + 'ToggleFixed':
        return { active: !this.state.mobile };
      default:
        break;
    }
    if (sn.endsWith('Submenu')) {
      return { active: this.state.expanded };
    } else if (sn.endsWith('SubItem')) {
      const classes = s.classes;
      classes.link = "d-block ps-4 p-2";
      return {
        iconSize: this.props.iconSize,
        activeLabel: this.state.expanded,
        exact: !this.state.expanded,
        classes
      }
    } else if (s.component === 'MenuItem') {
      return {
        iconSize: this.props.iconSize,
        activeLabel: this.state.expanded,
        exact: !this.state.expanded
      }
    }
    return this.state[sn];
  }

  content(children = this.props.children) {
    this.classes = Array.from(this.state.classSet).flat().join(' ');
    return super.content(children);
  }

  render() {
    return this.state.open
      ? React.createElement(React.Fragment, {},
        this.state.mobile && React.createElement('div',
          {
            className: "panel-touchClose",
            onClick: () => this.onUpdate({ open: false }, true)
          }
        ),
        super.render()
      )
      : React.createElement('div',
        {
          className: "panel-slide2open", ref: this.ref,
          onTouchStart: this.onTouchStart,
          onTouchEnd: this.onTouchEnd
        }
      );
  }

}