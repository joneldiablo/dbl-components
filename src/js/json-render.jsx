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
          break;
        default:
          return;
      }
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
    if (typeof content === 'string') {
      return (<React.Fragment key={content.name || index}>
        {parseReact(content, this.parseOpts)}
      </React.Fragment>);
    } else if (React.isValidElement(content)) {
      content.key = content.name || index;
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
    const { component: componentName, content, label, ...section } = sectionRaw;
    const { location, match, history, routesIn, children } = this.props;
    let Component = COMPONENTS[componentName] || (COMPONENTS.Component);
    let componentProps = {
      ...section,
      label: (typeof label === 'object' ? this.buildContent(label) : label),
      location,
      match,
      history
    }
    if (content || (routesIn === section.name)) {
      componentProps.children = (routesIn === section.name ?
        <>
          {this.buildContent(content)}
          {children}
        </> :
        this.buildContent(content)
      )
    }

    const cnSection = [componentProps.name + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    const exclusionSec = ['NavLink', 'Image', 'Link', 'Icons', 'Action',
      'DropdownButtonContainer', 'ModalButtonContainer']
      .includes(componentName);
    const Wrapper = Component.wrapper || 'section';
    return (exclusionSec || componentProps.tag ?
      <Component key={componentProps.name || i} {...componentProps} /> :
      <Wrapper key={componentProps.name || i} className={cnSection.join(' ')}>
        <Component {...componentProps} />
      </Wrapper>);
  }

}
