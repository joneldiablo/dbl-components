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
      const props = (!(child.props?.style && child.props.style['--component-name'])
        ? child : child.props.children).props;

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
    const hc = ['card-header'],
      bc = ['card-body'],
      fc = ['card-footer'];

    if (headerClasses) hc.push(headerClasses);
    if (bodyClasses) bc.push(bodyClasses);
    if (footerClasses) fc.push(footerClasses);

    return React.createElement(React.Fragment, {},
      !!theContent.header.length &&
      React.createElement('div', { className: hc.flat().filter(Boolean).join(' ') }, theContent.header),
      React.createElement('div', { className: bc.flat().filter(Boolean).join(' ') }, theContent.body),
      !!theContent.footer.length &&
      React.createElement('div', { className: fc.flat().filter(Boolean).join(' ') }, theContent.footer)
    );
  }

}