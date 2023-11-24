import React from "react";

import Group from "./group";

export default class CardGroup extends Group {

  static jsClass = 'CardGroup';

  constructor(props) {
    super(props);
    this.state.localClasses = 'card';
  }

  content(children = this.props.children) {
    const { label, fields, labelClasses } = this.props;
    return React.createElement('div',
      { className: "card-body" },
      label && React.createElement('label', { className: labelClasses }, label),
      fields && fields.map(this.mapFields),
      children
    )
  }

}