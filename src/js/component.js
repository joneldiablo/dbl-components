import React, { createRef } from "react";
import PropTypes from "prop-types";

import eventHandler from "./functions/event-handler";

export default class Component extends React.Component {

  static jsClass = 'Component';
  static propTypes = {
    _props: PropTypes.object,
    active: PropTypes.bool,
    children: PropTypes.node,
    classes: PropTypes.oneOfType([
      PropTypes.string, PropTypes.object,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    name: PropTypes.string.isRequired,
    style: PropTypes.object,
    tag: PropTypes.elementType
  };
  static defaultProps = {
    classes: '',
    style: {},
    active: true
  };

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
    this.onEvent = this.onEvent.bind(this);
    this.eventHandlers = {
      onClick: this.onEvent,
      onChange: this.onEvent,
      onMouseOver: this.onEvent,
      onMouseOut: this.onEvent,
      onKeyDown: this.onEvent,
      onLoad: this.onEvent
    }
  }

  setClasses(classes) {
    const localClasses = this.state.localClasses && (Array.isArray(this.state.localClasses)
      ? this.state.localClasses
      : this.state.localClasses.split(' '));
    const setLocalClasses = new Set(localClasses);
    if (!classes) return [setLocalClasses, new Set()];
    const setClasses = new Set(
      classes && (Array.isArray(classes)
        ? classes.flatMap(c => c.split(' '))
        : classes.split(' '))
    );
    return [setLocalClasses, setClasses];
  }

  toggleClasses(classes) {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach(c => {
      if (localClasses.has(c)) localClasses.delete(c);
      else localClasses.add(c);
    });
    this.setState({
      localClasses: Array.from(localClasses).flat().join(' ')
    });
    return true;
  }

  addClasses(classes) {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach(localClasses.add.bind(localClasses));
    this.setState({
      localClasses: Array.from(localClasses).flat().join(' ')
    });
    return true;
  }

  deleteClasses(classes) {
    if (!classes) return false;
    const [localClasses, setClasses] = this.setClasses(classes);
    setClasses.forEach(localClasses.delete.bind(localClasses));
    this.setState({
      localClasses: Array.from(localClasses).flat().join(' ')
    });
    return true;
  }

  get componentProps() {
    return this.props._props;
  }

  content(children = this.props.children) {
    return children;
  }

  onEvent(e) {
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
    const cn = [this.constructor.jsClass, name, this.name, this.classes, localClasses];
    if (!!classes) cn.push(typeof classes === 'string' ? classes : (Array.isArray(classes) ? classes.flat().join(' ') : classes['.']));
    const s = Object.assign({}, this.style, localStyles, style);
    const Tag = tag || this.tag;
    return (active
      ? React.createElement(Tag, {
        className: cn.flat().join(' '),
        style: s, ref: this.ref,
        ...this.eventHandlers,
        ...this.componentProps
      },
        content
      )
      : React.createElement(React.Fragment));
  }
}
