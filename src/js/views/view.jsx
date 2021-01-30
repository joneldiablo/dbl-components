import React from "react";
import PropTypes from "prop-types";
import { hash } from "../functions";
import NavbarContainer from "../containers/navbar-container";
import Container from "../containers/container";
import TestComponent from "../debug-component";

const DefaultComponent = Container;

const COMPONENTS = {
  TestComponent,
  NavbarContainer,
  Container
}

export const addComponents = (newComponents) => {
  Object.assign(COMPONENTS, newComponents);
}

export default class View extends React.Component {

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

  buildContent() {
    // crear un clone de lo que se recibe
    const schemaContentStr = JSON.stringify(this.props.content);
    const contentSchema = JSON.parse(schemaContentStr);
    // guardar un identificador de la cadena
    this.contentHash = hash(schemaContentStr);
    // se crean las rutas de forma única.
    const content = Array.isArray(contentSchema) ?
      contentSchema.map(this.sections) :
      <div key="content" dangerouslySetInnerHTML={{ __html: contentSchema }} />;
    this.setState({
      content
    });
  }

  componentDidMount() {
    this.buildContent();
  }

  componentDidUpdate(prevProps, prevState) {
    // comprobar que haya cambiado el contenido para actualizar
    let isEq = this.contentHash !== hash(JSON.stringify(this.props.content));
    if (isEq) {
      this.buildContent();
    }
  }

  sections = (section, i) => {
    const { location, match, history, childrenIn, children } = this.props;
    let Component = COMPONENTS[section.component] || (DefaultComponent);
    let subcontent = Array.isArray(section.content) ?
      section.content.map(this.sections) :
      [!!section.content && <div key="0-str-content" dangerouslySetInnerHTML={{ __html: section.content }} />];
    if (childrenIn && childrenIn === section.name) {
      subcontent.push(children);
    }
    let componentProps = {
      ...section,
      location,
      match,
      history
    }

    return (<section key={i + '-' + section.name}>
      <Component {...componentProps}>
        {subcontent}
      </Component>
    </section>);
  }

  render() {
    const { classes, style, name, childrenIn, children } = this.props;
    const { content } = this.state;
    const cn = [this.constructor.name, name + '-view', classes];
    return (<div id={name} className={cn.join(' ')} style={style}>
      {content}
      {!childrenIn && children}
    </div>);
  }

}