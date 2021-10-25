import React from "react";
import PropTypes from "prop-types";

import eventHandler from "../functions/event-handler";
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
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
  }

  componentDidMount() {
    super.componentDidMount();
    this.events.forEach(e => eventHandler.subscribe(...e));
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
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName));
  }

  mutations(sectionName, section) {
    return this.state[sectionName];
  }

  content(children = this.props.children) {
    const { routesIn, content } = this.props;
    return <>
      {this.jsonRender.buildContent(content)}
      {!routesIn && children}
    </>
  }

}
