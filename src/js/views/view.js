import React from "react";
import PropTypes from "prop-types";

import JsonRenderContainer from "../containers/json-render-container";

/**
 * View component that extends JsonRenderContainer
 */
export default class View extends JsonRenderContainer {
  static jsClass = "View";

  static propTypes = {
    ...JsonRenderContainer.propTypes,
    test: PropTypes.bool,
  };

  static defaultProps = {
    ...JsonRenderContainer.defaultProps,
    test: false,
    content: {},
  };

  tag = "article";
  events = [];

  constructor(props) {
    super(props);
    Object.assign(this.state, {
      localClasses: this.props.test ? "test-view-wrapper" : "",
    });
  }

  get fixedProps() {
    return {
      ...this.props,
      childrenIn: this.props.routesIn,
    };
  }

  get childrenIn() {
    return this.props.routesIn;
  }

  get theView() {
    return this.props.content;
  }

  componentDidUpdate(prevProps, prevState) {
    super.componentDidUpdate(prevProps, prevState);

    const { test, location } = this.props;

    // 🚨 Forzar re-render si cambió la ruta (pathname)
    if (location?.pathname !== prevProps.location?.pathname) {
      console.log("cambió el path!!!!");
      this.forceUpdate();
    }

    if (prevProps.test !== test) {
      const { localClasses } = this.state;
      const setClasses = new Set(localClasses.split(" "));
      if (test) {
        setClasses.add("test-view-wrapper");
      } else {
        setClasses.delete("test-view-wrapper");
      }
      this.setState({
        localClasses: [...setClasses].join(" "),
      });
    }
  }
}
