import React from "react";
import PropTypes from "prop-types";
import "details-polyfill";

import { eventHandler } from "dbl-utils";

import Component from "../component";

export default class DetailsContainer extends Component {

  static jsClass = 'DetailsContainer';
  static propTypes = {
    ...Component.propTypes,
    open: PropTypes.bool
  };

  tag = 'details';
  events = [];

  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    Object.assign(this.eventHandlers, { onToggle: this.onEvent });
    this.events.push(
      ['update.' + props.name, this.onUpdate.bind(this)]
    );
    Object.assign(this.state, {
      open: !!this.props.open
    });
  }

  get componentProps() {
    return Object.assign({ open: this.state.open }, this.props._props);
  }

  componentDidMount() {
    this.ref.current.addEventListener('toggle', this.onToggle);
    this.events.forEach(evt => eventHandler.subscribe(...evt, this.name));
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('toggle', this.onToggle);
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.name));
  }

  onUpdate({ open }) {
    const newState = {};
    if (typeof open === 'boolean')
      newState.open = open;
    this.setState(newState);
  }

  onToggle(evt) {
    const open = evt.newState === 'open';
    this.setState({ open });
    eventHandler.dispatch(this.props.name, { [this.props.name]: evt.newState, id: this.props.id, data: this.props.data });
  }

  content(children = this.props.children) {
    const { containerClasses, labelClasses } = this.props;
    const cnl = [labelClasses];
    const cnc = [containerClasses];
    return React.createElement(React.Fragment, {},
      React.createElement('summary', { className: cnl.flat().filter(Boolean).join(' ') }, this.props.label),
      this.state.open && React.createElement('div', { className: cnc.flat().filter(Boolean).join(' ') }, children)
    );
  }

}