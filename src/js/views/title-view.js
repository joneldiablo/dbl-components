import React from "react";

import View from "./view";

export default class TitleView extends View {

  static jsClass = 'TitleView';

  content(children = this.props.children) {
    const { label, labelClasses } = this.props;
    return (
      React.createElement(React.Fragment, {},
        React.createElement('h1',
          { className: labelClasses },
          label
        ),
        super.content(children)
      )
    );
  }

}