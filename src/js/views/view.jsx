import React from "react";
import PropTypes from "prop-types";
import parseReact, { domToReact, attributesToProps } from "html-react-parser";
import { NavLink, Link } from "react-router-dom";
import Icons from "../media/icons";
import COMPONENTS from "../components";

export default class View extends COMPONENTS.Component {

  static propTypes = {
    classes: PropTypes.string,
    style: PropTypes.object,
    name: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object
    ])
  }

  state = {
    content: []
  }

  localClasses = '';
  localStyles = {};
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

  constructor(props) {
    super(props);
    this.sections = this.sections.bind(this);
    this.buildContent = this.buildContent.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { test } = this.props;
    // add class test-view-wrapper
    // why react is so complicated? with classList just add class or remove =/
    if (prevProps.test != test) {
      const { localClasses } = this.state;
      const setClasses = new Set(localClasses.split(' '));
      if (test) {
        setClasses.add('test-view-wrapper');
      } else {
        setClasses.delete('test-view-wrapper');
      }
      this.setState({
        localClasses: [...setClasses].join(' ')
      });
    }
  }


  buildContent(content, index) {
    if (!content) return false;
    if (typeof content === 'string') {
      return (<React.Fragment key={index + '-' + content.name}>
        {parseReact(content, this.parseOpts)}
      </React.Fragment>);
    } else if (React.isValidElement(content)) {
      content.key = index + '-' + content.name;
      return content;
    } else if (Array.isArray(content)) return content.map(this.buildContent);
    else if (typeof content === 'object' && typeof content.name !== 'string')
      return Object.keys(content)
        .map((name, i) => this.buildContent({ name, ...content[name] }, i));
    return this.sections(content, index);
  }

  mutations(section) {
    return false;
  }

  sections(sectionRaw, i) {
    const m = this.mutations(sectionRaw.name);
    if (m) {
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
    return (['NavLink', 'Image', 'Link', 'Icons', 'Action', 'DropdownButtonContainer', 'ModalButtonContainer']
      .includes(componentName) || ['span', 'small', 'a', 'br', 'hr', 'p', 'u', 's', 'b', 'img'].includes(componentProps.tag) ?
      <Component key={i + '-' + componentProps.name} {...componentProps} /> :
      <section key={i + '-' + componentProps.name} className={cnSection.join(' ')}>
        <Component {...componentProps} />
      </section>);
  }

  content(children = this.props.children) {
    const { routesIn, content } = this.props;
    return <>
      {this.buildContent(content)}
      {!routesIn && children}
    </>
  }

}
