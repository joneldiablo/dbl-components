import React from "react";
import { NavLink, Link } from "react-router-dom";
import parseReact, { domToReact, attributesToProps } from "html-react-parser";

import Icons from "./media/icons";
import COMPONENTS from "./components";
import { hash } from "./functions";

/**
 * Clase utilizada para generar contenido dinámico en React a partir de una estructura de datos JSON.
 *
 * @class JsonRender
 */
export default class JsonRender {

  /**
   * Opciones para el análisis del contenido HTML.
   * @type {Object}
   */
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
      return React.createElement(C7tReplace,
        { ...attributesToProps(domNode.attribs) },
        domToReact(domNode.children, this.parseOpts)
      );
    }
  }

  /**
   * Crea una instancia de JsonRender.
   * @param {Object} props - Las propiedades del componente.
   * @param {Object} mutations - Las mutaciones para las secciones.
   */
  constructor(props, mutations) {
    this.props = props;
    this.mutations = mutations;
    this.sections = this.sections.bind(this);
    this.buildContent = this.buildContent.bind(this);
  }

  /**
   * Construye el contenido basado en la estructura de datos proporcionada.
   * @param {any} content - El contenido a construir.
   * @param {number} index - El índice del contenido.
   * @returns {React.Component|React.Fragment|boolean} - El componente construido.
   */
  buildContent(content, index) {
    if (!content) return false;
    if (typeof content === 'number') {
      return content;
    } else if (typeof content === 'string') {
      return React.createElement(React.Fragment,
        { key: hash(content) },
        parseReact(content, this.parseOpts)
      );
    } else if (React.isValidElement(content)) {
      try {
        content.key = content.key || content.props.name || index;
      } catch (error) {
      }
      return content;
    } else if (Array.isArray(content)) return content.map(this.buildContent);
    if (Array.isArray(content.name)) content.name = content.name.join('-');
    if (typeof content === 'object' && typeof content.name !== 'string')
      return Object.keys(content)
        .map((name, i) => this.buildContent({ name, ...content[name] }, i));

    return this.sections(content, index);
  }

  /**
   * Construye una sección basada en la información proporcionada.
   * @param {Object} sectionRaw - Los datos de la sección.
   * @param {number} i - El índice de la sección.
   * @returns {React.Component|boolean} - El componente de la sección construido.
   */
  sections(sectionRaw, i) {
    if (typeof this.mutations === 'function') {
      const m = this.mutations(sectionRaw.name, sectionRaw) || {};
      //Si la mutacion contiene elementos react, hacer un deepMerge truena con loop infinito
      Object.assign(sectionRaw, m);
    }
    if (typeof sectionRaw.active === 'boolean' && !sectionRaw.active) return false;
    const { component: componentName, content, placeholder,
      label, message, errorMessage, managerName, wrapperClasses, ...section } = sectionRaw;
    const { location, match, childrenIn = this.childrenIn, history, children } = this.props;
    const Component = COMPONENTS[componentName] || (COMPONENTS.Component);
    const componentProps = {
      ...section,
      managerName: managerName || this.props.name,
      label: this.buildContent(label),
      placeholder: this.buildContent(placeholder),
      message: this.buildContent(message),
      errorMessage: this.buildContent(errorMessage),
      location,
      match,
      history
    }
    if (Component.dontBuildContent) componentProps.content = content;
    if (!Component.dontBuildContent && content && (childrenIn === section.name)) {
      componentProps.children = React.createElement(React.Fragment, {},
        this.buildContent(content),
        children
      );
    } else if (!Component.dontBuildContent && content) {
      componentProps.children = this.buildContent(content);
    } else if (childrenIn === section.name) {
      componentProps.children = children;
    }

    const cnSection = [componentProps.name + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    if (this.props.wrapperClasses) cnSection.push(this.props.wrapperClasses);
    if (wrapperClasses) cnSection.push(wrapperClasses);
    const exclusionSec = ['NavLink', 'Image', 'Link', 'Icons', 'Action',
      'DropdownButtonContainer', 'ModalButtonContainer', 'DropdownItem']
      .includes(componentName);
    const Wrapper = componentProps.wrapper === false ? false :
      componentProps.wrapper || Component.wrapper || 'section';

    if (!Wrapper || exclusionSec || componentProps.tag) {
      if (this.props.test) {
        if (!componentProps.style) componentProps.style = {};
        componentProps.style.border = '1px solid yellow';
      }
      return React.createElement(Component, { key: componentProps.name || i, ...componentProps })
    }

    return (React.createElement(Wrapper,
      { key: componentProps.name || i, className: cnSection.flat().join(' ') },
      React.createElement(Component, { ...componentProps })
    ));
  }

}