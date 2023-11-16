import React, { createRef } from "react";
import PropTypes from "prop-types";

import eventHandler from "./functions/event-handler";

export default class Component extends React.Component {

  static jsClass = 'Component';
  static propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
    style: PropTypes.object,
    active: PropTypes.bool
  }
  static defaultProps: {
    classes?: any,
    style: any,
    active: boolean
  } = {
      classes: '',
      style: {},
      active: true
    }

  ready: any;
  props: any;
  ref: any;
  eventHandlers: any;
  tag = 'div';
  classes = '';
  style = {};
  name = this.props.name + '-' + (this.constructor as any).jsClass;

  state: any = {
    localClasses: '',
    localStyles: {}
  }

  constructor(props: any) {
    super(props);
    this.ref = createRef();
    this.eventHandlers = {
      onClick: this.onEvent,
      onChange: this.onEvent,
      onMouseOver: this.onEvent,
      onMouseOut: this.onEvent,
      onKeyDown: this.onEvent,
      onLoad: this.onEvent
    }
  }

  get componentProps() {
    return this.props._props;
  }

  content(children = this.props.children) {
    return children;
  }

  onEvent = (e: any) => {
    eventHandler.dispatch(`${e.type}.${this.props.name}`,
      { [this.props.name]: { state: this.state, value: e.target?.value } });
  }

  render() {
    const { classes, style, name, tag, active } = this.props;
    const { localClasses, localStyles } = this.state;
    if (!this.ready) {
      this.ready = setTimeout(() => eventHandler.dispatch(`ready.${name}`), 50);
    }
    const content = this.content();
    const cn = [(this.constructor as any).jsClass, this.props.name, this.name, this.classes, localClasses];
    if (!!classes) cn.push(typeof classes === 'string' ? classes : (Array.isArray(classes) ? classes.flat().join(' ') : classes['.']));
    const s = Object.assign({}, this.style, localStyles, style);
    const Tag = tag || this.tag;
    return (active
      ? React.createElement(Tag,
        {
          className: cn.join(' '),
          style: s, ref: this.ref,
          ...this.eventHandlers,
          ...this.componentProps
        },
        content
      )
      : React.createElement(React.Fragment));
  }
}
