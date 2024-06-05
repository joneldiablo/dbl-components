import React from "react";
import PropTypes from "prop-types";

import eventHandler from "../functions/event-handler";
import resolveRefs from "../functions/resolve-refs";
import deepMerge from "../functions/deep-merge";
import JsonRender from "../json-render";
import Container from "./container";

export default class JsonRenderContainer extends Container {

  static jsClass = 'JsonRenderContainer';
  static template = {
    view: {}, definitions: {}
  };

  static propTypes = {
    ...Container.propTypes,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ])
  }

  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true,
    view: null,
    childrenIn: false,
    definitions: {}
  }

  tag = 'div';
  events = [];

  constructor(props) {
    super(props);
    Object.assign(this.state, {
    });
    this.jsonRender = new JsonRender(this.fixedProps, this.mutations.bind(this));
  }

  get fixedProps() {
    return this.props;
  }

  get childrenIn() {
    return this.props.childrenIn;
  }

  get theView() {
    return this.constructor.template.view;
  }

  componentDidMount() {
    super.componentDidMount();
    this.events.forEach(([evtName, callback]) => eventHandler.subscribe(evtName, callback, this.name));
    const definitions = deepMerge(this.constructor.template.definitions || {}, this.props.definitions);

    this.templateSolved = this.props.view
      ? resolveRefs(this.props.view, {
        template: this.theView,
        definitions,
        props: this.props,
        state: this.state
      })
      : resolveRefs(this.theView, {
        definitions,
        props: this.props,
        state: this.state
      });

  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName, this.name));
  }

  mutations(sectionName, section) {
    return this.state[sectionName];
  }

  content(children = this.props.children) {
    if (!(this.breakpoint && this.templateSolved)) return this.waitBreakpoint;

    const builded = this.jsonRender.buildContent(this.templateSolved);
    return !this.childrenIn
      ? React.createElement(React.Fragment, {}, builded, children)
      : builded;
  }

}
