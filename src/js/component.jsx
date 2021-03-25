import React, { createRef } from "react";
import PropTypes from "prop-types";

export default class Component extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.string,
    style: PropTypes.object,
    active: PropTypes.bool
  }

  static defaultProps = {
    classes: '',
    style: {},
    active: true
  }

  tag = 'div';
  classes = '';
  state = {
    localClasses: '',
    localStyles: {}
  }

  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  get name() {
    return this.props.name + '-' + this.constructor.name;
  }

  content(children = this.props.children) {
    return children;
  }

  render() {
    const { classes, style, name, tag, active } = this.props;
    const { localClasses, localStyles } = this.state;
    const content = this.content();
    const cn = [this.constructor.name, this.name, localClasses, classes, this.classes];
    const s = Object.assign({}, localStyles, style);
    const Tag = tag || this.tag;
    return (active ? <Tag id={name} className={cn.join(' ')} style={s} ref={this.ref} onClick={this.onClick} {...this.componentProps}>
      {content}
    </Tag> : <React.Fragment />);
  }
}
