import React from "react";
import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ActionComponent extends Component {

  tag = 'button';

  constructor(props) {
    super(props);
    this.state.localClasses = 'btn';
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    eventHandler.dispatch(this.name);
  }

  content(children = this.props.children) {
    return children;
  }

}
