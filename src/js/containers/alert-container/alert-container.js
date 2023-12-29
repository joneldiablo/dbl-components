import React from "react";

import eventHandler from "../../functions/event-handler";
import Component, { nameSuffixes } from "../../complex-component";

import schema from "./alert-schema.json";

/*
classes: py-2 notification 
toggle: alert-dismissible alert-success text-success
.label-icon { margin-bottom: 1px; }
    
*/

export default class extends Component {

  static jsClass = 'AlertContainer';
  static defaultProps = {
    ...Component.defaultProps,
    schema,
    iconSize: 20,
    color: 'primary',
    showClose: true,
    definitions: {},
    classes: {
      '.': '',
      label: 'mb-0',
      icon: '',
      description: '',
      close: ''
    },
    rules: {
      ...nameSuffixes(["Label", "Description", "Close"])
    }
  }
  static dontBuildContent = true;
  static wrapper = false;
  classes = 'alert fade show shadow-sm';

  constructor(props) {
    super(props);
    this.setClasses = new Set();
    Object.assign(this.state, {
      localClasses: this.buildClasses({})
    });
  }

  componentDidUpdate(prevProps) {
    const classes = this.buildClasses(prevProps);
    if (classes !== this.state.localClasses) {
      this.setState({ localClasses: classes });
    }
  }

  buildClasses(prevProps) {
    if (prevProps.color !== this.props.color) {
      this.setClasses.delete('alert-' + prevProps.color);
      this.setClasses.delete('text-' + prevProps.color);
      this.setClasses.add('alert-' + this.props.color);
      this.setClasses.add('text-' + this.props.color);
    }
    if (prevProps.showClose !== this.props.showClose) {
      this.setClasses[this.props.showClose ? 'add' : 'delete']('alert-dismissible');
    }
    return Array.from(this.setClasses).join(' ');
  }

  mutations(sn, section) {
    const { name } = this.props;
    switch (sn) {
      case name + 'Label':
        return {
          icon: this.props.icon,
          label: this.props.label,
          classes: {
            '.': (this.props.classes?.label || '') + ' alert-heading',
            'icon': (this.props.classes?.icon || '') + ' alert-icon align-text-middle'
          }
        };
      case name + 'Description':
        return {
          classes: (this.props.classes?.description || '') + (this.props.icon ? ' ps-4' : ''),
          content: this.props.content
        };
      case name + 'Close':
        return {
          active: this.props.showClose,
          classes: (this.props.classes?.close || '') + ' btn-close'
        };
      default:
        break;
    }
    return super.mutations(sn, section);
  }

}