import React from "react";
import PropTypes from "prop-types";
import Component from "../component";
import "details-polyfill";

export default class DetailsContainer extends Component {

  static jsClass = 'DetailsContainer';
  static propTypes = {
    ...Component.propTypes,
    open: PropTypes.bool
  };

  tag = 'details';

  constructor(props) {
    super(props);
    Object.assign(this.eventHandlers, { onToggle: this.onEvent });
  }

  content(children = this.props.children) {
    const { containerClasses, labelClasses } = this.props;
    return <>
      <summary className={labelClasses}>{this.props.label}</summary>
      <div className={containerClasses}>
        {children}
      </div>
    </>
  }

}