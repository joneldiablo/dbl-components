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
      PropTypes.array
    ])
  }

  static defaultProps = {
    classes: '',
    style: {}
  }

  state = {
    content: []
  }

  localClasses = '';
  localStyles = {};

  constructor(props) {
    super(props);
    this.sections = this.sections.bind(this);
  }

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

  buildContent() {
    // crear un clone de lo que se recibe
    const schemaContentStr = JSON.stringify(this.props.content);
    const contentSchema = JSON.parse(schemaContentStr);
    // se crea el contenido de forma única.
    let content;
    if (Array.isArray(contentSchema))
      content = contentSchema.map(this.sections)
    else if (typeof contentSchema === 'object')
      content = Object.keys(contentSchema)
        .map((name, i) => this.sections({ ...contentSchema[name], name }, i));
    else
      content = parseReact(contentSchema, this.parseOpts);

    this.setState({
      content,
      localClasses: this.props.test ? 'test-view-wrapper' : ''
    });
  }

  componentDidMount() {
    this.buildContent();
  }

  componentDidUpdate(prevProps, prevState) {
    // comprobar que haya cambiado el contenido para actualizar
    let newHash = hash(JSON.stringify(this.props.content));
    if (this.contentHash !== newHash) {
      // guardar un identificador de la cadena
      this.contentHash = newHash;
      this.buildContent();
    }
  }

  sections(sectionRaw, i) {
    if (React.isValidElement(sectionRaw)) return sectionRaw;
    if (typeof sectionRaw === 'string') {
      return (<section key={i + '-' + sectionRaw.name}>
        {parseReact(sectionRaw, this.parseOpts)}
      </section>);
    }
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

    switch (componentName) {
      case 'NavLink':
      case 'Link':
      case 'Icons':
        return <Component key={i + '-' + section.name} {...componentProps}>
          {subcontent}
        </Component>;
      default:
        return (<section key={i + '-' + section.name} className={cnSection.join(' ')}>
          <Component {...componentProps}>
            {subcontent}
          </Component>
        </section>);
    }
  }

  content(children = this.props.children) {
    const { routesIn } = this.props;
    const { content } = this.state;
    return <>
      {content}
      {!routesIn && children}
    </>
  }

}
