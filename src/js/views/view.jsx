import React from "react";
import PropTypes from "prop-types";
import parseReact, { domToReact, attributesToProps } from "html-react-parser";
import { NavLink, Link } from "react-router-dom";
import { hash } from "../functions";
import Component from "../component";
import Icons from "../media/icons";
import COMPONENTS from "../components";

const DefaultComponent = Component;

export default class View extends Component {

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
          C7tReplace = Link;
          if (domNode.attribs.href && !domNode.attribs.to)
            domNode.attribs.to = domNode.attribs.href;
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


  buildContent() {
    const { content } = this.props;
    if (Array.isArray(content))
      return content.map(this.sections);
    else if (typeof content === 'object')
      return Object.keys(content)
        .map((name, i) => this.sections({ ...content[name], name }, i));
    else
      return parseReact(content, this.parseOpts);
  }

  sections(sectionRaw, i) {
    if (React.isValidElement(sectionRaw)) return sectionRaw;
    if (typeof sectionRaw === 'string') {
      return (<React.Fragment key={i + '-' + sectionRaw.name}>
        {parseReact(sectionRaw, this.parseOpts)}
      </React.Fragment>);
    }
    if (typeof sectionRaw.active === 'boolean' && !sectionRaw.active) return false;
    const { component: componentName, ...section } = sectionRaw;
    const { location, match, history, routesIn, children } = this.props;
    let Component = COMPONENTS[componentName] || (DefaultComponent);
    let componentProps = {
      ...section,
      // views que hereden de este componente podrían mandarle 
      // datos a los componentes por el name de cada uno
      ...this.state[section.name],
      location,
      match,
      history
    }
    let subcontent;
    if (Array.isArray(componentProps.content))
      subcontent = componentProps.content.map(this.sections)
    else if (typeof componentProps.content === 'object')
      subcontent = Object.keys(componentProps.content)
        .map((name, i) => this.sections({ ...componentProps.content[name], name }, i));
    else
      subcontent = [!!componentProps.content && <React.Fragment key="content">
        {parseReact(componentProps.content, this.parseOpts)}
      </React.Fragment>];
    const cnSection = [componentProps.name + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    if (routesIn && routesIn === componentProps.name) {
      subcontent.push(children);
      if (this.props.test) cnSection.push('overflow-auto');
    }

    const finalComponent =
      (<Component key={i + '-' + section.name} {...componentProps}>
        {subcontent}
      </Component>);
    return (['NavLink', 'Image', 'Link', 'Icons', 'Action']
      .includes(componentName) ? finalComponent :
      <section key={i + '-' + section.name} className={cnSection.join(' ')}>
        {finalComponent}
      </section>);
  }

  content(children = this.props.children) {
    const { routesIn } = this.props;
    return <>
      {this.buildContent()}
      {!routesIn && children}
    </>
  }

}
