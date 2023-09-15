import React from "react";
import PropTypes from "prop-types";

import eventHandler from "../functions/event-handler";
import Icons from "../media/icons";
import Container from "../containers/container";
import JsonRender from "../json-render";

export default class View extends Container {

  static jsClass = 'View';

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
    fullWidth: true
  }

  events = [];

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      content: [],
      localClasses: this.props.test ? 'test-view-wrapper' : ''
    });
    const propsJR = { ...props };
    propsJR.childrenIn = propsJR.routesIn;
    delete propsJR.routesIn;
    this.jsonRender = new JsonRender(propsJR, this.mutations.bind(this));
  }

  componentDidMount() {
    super.componentDidMount();
    this.events.forEach(([evtName, callback]) => eventHandler.subscribe(evtName, callback, this.name));
  }

  componentDidUpdate(prevProps, prevState) {
    const { test } = this.props;
    // add class test-view-wrapper
    // why react is so complicated? with classList just add class or remove =/
    if (prevProps.test != test) {
      const { localClasses } = this.state;
      const setClasses = new Set(localClasses.split(' '));
      if (test) {
        setClasses.add('test-view-wrapper');
      } else {
        setClasses.delete('test-view-wrapper');
      }
      this.setState({
        localClasses: [...setClasses].join(' ')
      });
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName, this.name));
  }

  mutations(sectionName, section) {
    return this.state[sectionName];
  }

  content(children = this.props.children) {
    const { routesIn, content } = this.props;
    return !!this.breakpoint ? <>
      {this.jsonRender.buildContent(content)}
      {!routesIn && children}
    </> : this.waitBreakpoint
  }

}
