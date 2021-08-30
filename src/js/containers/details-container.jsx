import React from "react";
import Component from "../component";

export default class DetailsContainer extends Component {

  static jsClass = 'DetailsContainer';
  tag = 'details';

  constructor(props) {
    super(props);
    Object.assign(this.eventHandlers, { onToggle: this.onEvent });
  }

  content(children = this.props.children) {
    const { containerClasses } = this.props;
    return <>
      <summary>{this.props.label}</summary>
      <div className={containerClasses}>
        {children}
      </div>
    </>
  }

}