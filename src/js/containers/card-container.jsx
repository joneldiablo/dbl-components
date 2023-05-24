import React from "react";
import Container from "./container";

export default class CardContainer extends Container {

  static jsClass = 'CardContainer';
  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true,
    headerClasses: '',
    bodyClasses: '',
    footerClasses: ''
  }

  classes = 'card';

  constructor(props) {
    super(props);
  }

  content(children = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;
    const theContent = {
      header: [],
      body: [],
      footer: []
    }
    const { headerClasses,
      bodyClasses,
      footerClasses } = this.props;
    children.forEach((child, i) => {
      if (!child) return;
      const props = child.type === 'section' ? child.props.children.props : child.props;

      if (props.header) {
        theContent.header.push(child);
      } else if (props.footer) {
        theContent.footer.push(child);
      } else if (props.container) {
        theContent[props.container].push(child);
      } else {
        theContent.body.push(child);
      }
    });
    return <>
      {!!theContent.header.length &&
        <div className={'card-header ' + headerClasses}>{theContent.header}</div>}
      <div className={'card-body ' + bodyClasses}>
        {theContent.body}
      </div>
      {!!theContent.footer.length &&
        <div className={'card-footer ' + footerClasses}>{theContent.footer}</div>}
    </>;
  }

}