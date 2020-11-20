import React from "react";

export default class HiddenField extends React.Component {

  static defaultProps = {
    name: null,
    value: null
  }

  // Renders
  render() {
    let {
      name, value
    } = this.props;
    let inputProps = {
      id: name,
      name,
      type: 'hidden',
      value
    }
    return <input {...inputProps} />
  }

}
