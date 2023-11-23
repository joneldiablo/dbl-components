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
  static defaultProps = {
    classes: '',
    style: {},
    active: true
  }

  tag = 'div';
  classes = '';
  style = {};
  name = this.props.name + '-' + this.constructor.jsClass;

  state = {
    localClasses: '',
    localStyles: {}
  }

  constructor(props) {
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

  onEvent = (e) => {
    eventHandler.dispatch(`${e.type}.${this.props.name}`,
      { [this.props.name]: { state: this.state, value: e.target.value } });
  }

  render() {
    const { classes, style, name, tag, active } = this.props;
    const { localClasses, localStyles } = this.state;
    if (!this.ready) {
      this.ready = setTimeout(() => eventHandler.dispatch(`ready.${name}`), 50);
    }
    const content = this.content();
    const cn = [this.constructor.jsClass, this.name, this.classes, localClasses];
    if (!!classes) cn.push(typeof classes === 'string' ? classes : (Array.isArray(classes) ? classes.flat().join(' ') : classes['.']));
    const s = Object.assign({}, this.style, localStyles, style);
    const Tag = tag || this.tag;
    return (active
      ? React.createElement(Tag, {
        id: name, className: cn.join(' '),
        style: s, ref: this.ref,
        ...this.eventHandlers,
        ...this.componentProps
      },
        content
      )
      : React.createElement(React.Fragment));
  }
}
