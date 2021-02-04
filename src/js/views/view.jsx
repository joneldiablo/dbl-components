import React from "react";
import PropTypes from "prop-types";
import parseReact, { domToReact } from "html-react-parser";
import { NavLink } from "react-router-dom";
import { hash } from "../functions";
import NavbarContainer from "../containers/navbar-container";
import Container from "../containers/container";
import GridContainer from "../containers/grid-container";
import HeroContainer from "../containers/hero-container";
import AspectRatioContainer from "../containers/aspect-ratio-container";
import GridSwitchContainer from "../containers/grid-switch-container";
import CardContainer from "../containers/card-container";
import Debug from "../debug-component";
import Navigation from "../navigation/navigation";
import BrandNavigation from "../navigation/brand-navigation";
import YoutubeVideoComponent from "../media/youtube-video";
import Component from "../component";

const DefaultComponent = Component;

const COMPONENTS = {
  Debug,
  Container,
  NavbarContainer,
  GridContainer,
  GridSwitchContainer,
  HeroContainer,
  CardContainer,
  AspectRatioContainer,
  Navigation,
  BrandNavigation,
  Component,
  YoutubeVideoComponent
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

  parseOpts = {
    replace: domNode => {
      if (domNode.name === 'navlink') {
        console.log(domNode);
        return <NavLink to={domNode.attribs.to}>
          {domToReact(domNode.children, this.parseOpts)}
        </NavLink>;
      }
    }
  }

  buildContent() {
    // crear un clone de lo que se recibe
    const schemaContentStr = JSON.stringify(this.props.content);
    const contentSchema = JSON.parse(schemaContentStr);
    // guardar un identificador de la cadena
    this.contentHash = hash(schemaContentStr);
    // se crean las rutas de forma única.
    const content = Array.isArray(contentSchema) ?
      contentSchema.map(this.sections) : parseReact(contentSchema, this.parseOpts);
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
      return (<section key={i + '-' + section.name} className="h-auto">
        {parseReact(section, this.parseOpts)}
      </section>);
    }
    const { location, match, history, childrenIn, children } = this.props;
    let Component = COMPONENTS[section.component] || (DefaultComponent);
    let subcontent = Array.isArray(section.content) ?
      section.content.map(this.sections) :
      [!!section.content && parseReact(section.content, this.parseOpts)];
    const cnSection = [section.name + '-section', 'h-auto'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    if (childrenIn && childrenIn === section.name) {
      subcontent.push(children);
      if (this.props.test) cnSection.push('overflow-auto');
    }
    let componentProps = {
      ...section,
      location,
      match,
      history
    }
    return (<section key={i + '-' + section.name} className={cnSection.join(' ')}>
      <Component {...componentProps}>
        {subcontent}
      </Component>
    </section>);
  }

  render() {
    const { classes, style, name, childrenIn, children, test } = this.props;
    const { content } = this.state;
    const cn = [this.constructor.name, name + '-view', classes, this.localClasses];
    if (test) cn.push('test-view-wrapper');
    const s = Object.assign({}, this.localStyles, style);
    return (<div id={name} className={cn.join(' ')} style={s}>
      {content}
      {!childrenIn && children}
    </div>);
  }

}