import React from "react";
import eventHandler from "../functions/event-handler";
import Component from "../component";

export default class ActionComponent extends Component {

  static jsClass = 'ActionComponent';
  static defaultProps = {
    ...Component.defaultProps,
    type: 'button'
  }

  tag = 'button';

  constructor(props) {
    super(props);
    this.state.localClasses = 'btn';
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { value, name, id } = this.props;
    let dispatch = name;
    if (value || id) {
      dispatch = { [name]: value, id }
    }
    eventHandler.dispatch(name, dispatch);
  }

  get componentProps() {
    return { type: this.props.type };
  }

  content(children = this.props.children) {
    return children;
  }

}
