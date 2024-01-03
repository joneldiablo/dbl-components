import PropTypes from 'prop-types';
import React from "react";

export default class Hero extends React.Component {

  static propTypes = {
    children: PropTypes.node
  }

  static jsClass = 'Hero';

  render() {
    return React.createElement('div',
      { style: { height: '100vh' } },
      this.props.children
    )
  }
}