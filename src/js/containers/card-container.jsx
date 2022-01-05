import React from "react";
import Container from "./container";

export default class CardContainer extends Container {

  static jsClass = 'CardContainer';
  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true
  }

  classes = 'card';

  constructor(props) {
    super(props);
  }

  content(children = this.props.children) {
    let header = [];
    let body = [];
    let footer = [];
    let { headerClasses,
      bodyClasses,
      footerClasses } = this.props;
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
      {!!header.length &&
        <div className={'card-header ' + headerClasses}>{header}</div>}
      <div className={'card-body ' + bodyClasses}>
        {body}
      </div>
      {!!footer.length &&
        <div className={'card-footer ' + footerClasses}>{footer}</div>}
    </>;
  }

}