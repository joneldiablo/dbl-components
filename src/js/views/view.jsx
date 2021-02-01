import React from "react";
import PropTypes from "prop-types";
import { hash } from "../functions";
import NavbarContainer from "../containers/navbar-container";
import Container from "../containers/container";
import GridContainer from "../containers/grid-container";
import GridSwitchContainer from "../containers/grid-switch-container";
import Debug from "../debug-component";
import Navigation from "../navigation/navigation";
import Component from "../component";

const DefaultComponent = Component;

const COMPONENTS = {
  Debug,
  Container,
  NavbarContainer,
  GridContainer,
  GridSwitchContainer,
  Navigation,
  Component
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

  localClasses = '';
  localStyles = {};

  constructor(props) {
    super(props);
    this.sections = this.sections.bind(this);
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

  sections(section, i) {
    if (typeof section === 'string') {
      return (<section key={i + '-' + section.name} dangerouslySetInnerHTML={{ __html: section }} />);
    }
    const { location, match, history, childrenIn, children } = this.props;
    let Component = COMPONENTS[section.component] || (DefaultComponent);
    let subcontent = Array.isArray(section.content) ?
      section.content.map(this.sections) :
      [!!section.content && <div key="0-str-content" dangerouslySetInnerHTML={{ __html: section.content }} />];
    const cnTest = this.props.test ? ['test-section-wrapper'] : [];
    if (childrenIn && childrenIn === section.name) {
      subcontent.push(children);
      if (this.props.test) cnTest.push('h-100 overflow-auto');
    }
    let componentProps = {
      ...section,
      location,
      match,
      history
    }
    return (<section key={i + '-' + section.name} className={cnTest.join(' ')}>
      <Component {...componentProps}>
        {subcontent}
      </Component>
    </section>);
  }

  render() {
    const { classes, style, name, childrenIn, children, test } = this.props;
    const { content } = this.state;
    const cn = [this.constructor.name, name + '-view', classes, this.localClasses];
    if(test) cn.push('test-view-wrapper');
    const s = Object.assign({}, this.localStyles, style);
    return (<div id={name} className={cn.join(' ')} style={s}>
      {content}
      {!childrenIn && children}
    </div>);
  }

}