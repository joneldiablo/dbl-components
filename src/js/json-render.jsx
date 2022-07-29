import React from "react";
import { NavLink, Link } from "react-router-dom";
import parseReact, { domToReact, attributesToProps } from "html-react-parser";

import Icons from "./media/icons";
import COMPONENTS from "./components";

export default class JsonRender {

  parseOpts = {
    replace: domNode => {
      let C7tReplace;
      switch (domNode.name) {
        case 'navlink':
          C7tReplace = NavLink;
          break;
        case 'a':
          if (!domNode.attribs.to && domNode.attribs.href) return;
          C7tReplace = Link;
          break;
        case 'icons':
          C7tReplace = Icons;
          domNode.attribs.inline = domNode.attribs.inline === 'false' ? false : true;
          break;
        case 'textarea':
        case 'input':
          domNode.defaultValue = domNode.value;
          domNode.defaultChecked = domNode.checked;
          delete domNode.value;
          delete domNode.checked;
        default:
          return;
      }
      Object.keys(domNode).forEach(k => {
        if (k.match(/^on[A-Z]/)) {
          domNode[k] = this.props[k];
        }
      });
      return <C7tReplace
        {...attributesToProps(domNode.attribs)}
        children={domToReact(domNode.children, this.parseOpts)}
      />;
    }
  }

  constructor(props, mutations) {
    this.props = props;
    this.mutations = mutations;
    this.sections = this.sections.bind(this);
    this.buildContent = this.buildContent.bind(this);
  }

  buildContent(content, index) {
    if (!content) return false;
    if (typeof content === 'number') {
      return content;
    } else if (typeof content === 'string') {
      return (<React.Fragment key={content.name || index}>
        {parseReact(content, this.parseOpts)}
      </React.Fragment>);
    } else if (React.isValidElement(content)) {
      try {
        content.key = content.name || index;
      } catch (error) {
      }
      return content;
    } else if (Array.isArray(content)) return content.map(this.buildContent);
    else if (typeof content === 'object' && typeof content.name !== 'string')
      return Object.keys(content)
        .map((name, i) => this.buildContent({ name, ...content[name] }, i));
    return this.sections(content, index);
  }

  sections(sectionRaw, i) {
    if (typeof this.mutations === 'function') {
      const m = this.mutations(sectionRaw.name, sectionRaw) || {};
      Object.assign(sectionRaw, m);
    }
    if (typeof sectionRaw.active === 'boolean' && !sectionRaw.active) return false;
    const { component: componentName, content, label, message, errorMessage, ...section } = sectionRaw;
    const { location, match, childrenIn = this.childrenIn, history, children } = this.props;
    const Component = COMPONENTS[componentName] || (COMPONENTS.Component);
    const componentProps = {
      ...section,
      label: this.buildContent(label),
      message: this.buildContent(message),
      errorMessage: this.buildContent(errorMessage),
      location,
      match,
      history
    }
    if (Component.dontBuildContent) componentProps.content = content;
    if (!Component.dontBuildContent && content && (childrenIn === section.name)) {
      componentProps.children = <>
        {this.buildContent(content)}
        {children}
      </>
    } else if (!Component.dontBuildContent && content) {
      componentProps.children = this.buildContent(content);
    } else if (childrenIn === section.name) {
      componentProps.children = children;
    }

    const cnSection = [componentProps.name + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    const exclusionSec = ['NavLink', 'Image', 'Link', 'Icons', 'Action',
      'DropdownButtonContainer', 'ModalButtonContainer', 'DropdownItem']
      .includes(componentName);
    const Wrapper = componentProps.wrapper === false ? false :
      componentProps.wrapper || Component.wrapper || 'section';
    return (!Wrapper || exclusionSec || componentProps.tag ?
      <Component key={componentProps.name || i} {...componentProps} /> :
      <Wrapper key={componentProps.name || i} className={cnSection.join(' ')}>
        <Component {...componentProps} />
      </Wrapper>);
  }

}
