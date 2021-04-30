import React from "react";
import Container from "./container";

export default class CardContainer extends Container {

  static jsClass = 'CardContainer';
  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true
  }

  constructor(props) {
    super(props);
    this.state.containerClasses = 'card mb-3';
  }

  content(children = this.props.children) {
    let header = [];
    let body = [];
    let footer = [];
    children.forEach((child, i) => {
      if (!child) return;
      const props = child.type === 'section' ? child.props.children.props : child.props;
      if (props.header) {
        header.push(child);
      } else if (props.footer) {
        footer.push(child);
      } else {
        body.push(child);
      }
    });
    return <>
      {!!header.length && <div className="card-header">{header}</div>}
      <div className="card-body">
        {body}
      </div>
      {!!footer.length && <div className="card-footer">{footer}</div>}
    </>;
  }

}