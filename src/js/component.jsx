import React, { createRef } from "react";
import PropTypes from "prop-types";

export default class Component extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    classes: '',
    style: {},
  }

  tag = 'div';
  state = {
    localClasses: '',
    localStyles: {}
  }

  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  get name() {
    const { name } = this.props;
    return name + '-' + this.constructor.name;
  }

  content(children = this.props.children) {
    return children;
  }

  render() {
    const { classes, style, name } = this.props;
    const { localClasses, localStyles } = this.state;
    const content = this.content();
    const cn = [this.constructor.name, this.name, localClasses, classes];
    const s = Object.assign({}, localStyles, style);
    const Tag = this.tag;
    return <Tag id={name} className={cn.join(' ')} style={s} ref={this.ref}>
      {content}
    </Tag>
  }
}
