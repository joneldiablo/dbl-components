import React from "react";
import PropTypes from "prop-types";
import View from "./view";

export default class TestView extends View {

  static propTypes = {
    ...View.propTypes
  }

  static defaultProps = {
    ...View.defaultProps
  }

  sections(section, i) {
    const { childrenIn } = this.props;
    const cn = ['test-section-wrapper'];
    if (childrenIn && childrenIn === section.name) {
      cn.push('h-100 overflow-auto');
    }
    return (<div key={i} className={cn.join(' ')} >{super.sections(section, i)}</div>);
  }

  render() {
    return (<div className="test-view-wrapper" >
      {super.render()}
    </div>);
  }

}