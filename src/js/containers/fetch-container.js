import React from "react";
import PropTypes from "prop-types";

import Component from "../component";

export default class FetchContainer extends Component {
  static jsClass = "FetchContainer";
  static propTypes = {
    ...Component.propTypes,
    url: PropTypes.string.isRequired,
    fetchProps: PropTypes.object
  }

  componentDidMount() {
    this.fetch();
  }

  async fetch() {
    const { url, fetchProps } = this.props;
    const r = await fetch(url, fetchProps).then(r => r.text());
    this.setState({ fetchContent: r });
  }

  content(children = this.props.children) {
    return React.createElement(React.Fragment, {},
      React.createElement('div', { dangerouslySetInnerHTML: { __html: this.state.fetchContent } }),
      children
    );
  }
}