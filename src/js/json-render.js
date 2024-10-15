import React from "react";
import { NavLink, Link } from "react-router-dom";
import parseReact, { domToReact, attributesToProps } from "html-react-parser";

import Icons from "./media/icons";
import COMPONENTS from "./components";
import { hash } from "./functions";
import t from "./functions/i18n";
import formatValue from "./functions/format-value";
import deepMerge from "./functions/deep-merge";

const excludeSectionWrapper = ['NavLink', 'Image', 'Link', 'Icons', 'SvgImports', 'Action',
  'DropdownButtonContainer', 'ModalButtonContainer', 'DropdownItem'];

export function addExclusions(exclusion) {
  excludeSectionWrapper.push(...[exclusion].flat());
};

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

  actualSections = [];

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
    if (typeof content !== 'object') {
      const translate = t(content, this.props.context);
      const section = this.actualSections[this.actualSections.length - 1];
      if (typeof translate === 'number' || typeof translate === 'boolean') {
        return formatValue(translate, section);
      } else if (typeof translate === 'string') {
        let parsed = parseReact(translate, this.parseOpts);
        if (typeof parsed === 'string') parsed = formatValue(parsed, section);
        return React.createElement(React.Fragment,
          { key: hash(translate) },
          parsed
        );
      }
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
        .map((name, i) => this.buildContent(typeof content[name] !== 'object'
          ? content[name] : { name, ...content[name] }, i)
        );
    this.actualSections.push(content);
    const builded = this.sections(content, index);
    this.actualSections.pop();
    return builded;
  }

  /**
   * Construye una sección basada en la información proporcionada.
   * @param {Object} sectionRaw - Los datos de la sección.
   * @param {number} i - El índice de la sección.
   * @returns {React.Component|boolean} - El componente de la sección construido.
   */
  sections(sr, i) {
    const m = (typeof this.mutations === 'function' && this.mutations(sr.name, sr)) || {};
    if (m.style && sr.style) m.style = deepMerge({}, sr.style, m.style);
    if (m._props && sr._props) m._props = deepMerge({}, sr._props, m._props);
    const sectionRaw = Object.assign({}, sr, m || {});
    if (sectionRaw.active === false) return false;

    const { component: componentName, content, placeholder,
      label, message, errorMessage, managerName, wrapperClasses, wrapperStyle = {}, ...section } = sectionRaw;
    const { navigate, location, match, childrenIn = this.childrenIn, children } = this.props;
    const Component = COMPONENTS[componentName] || (COMPONENTS.Component);
    const extraBuilded = [Component.slots].flat().filter(Boolean).reduce((eb, key) => {
      const tmp = section[key];
      section[key] = null;
      delete section[key];
      eb[key] = this.buildContent(tmp);
      return eb;
    }, {});
    const componentProps = {
      ...section,
      managerName: managerName || this.props.name,
      label: this.buildContent(label),
      placeholder: this.buildContent(placeholder),
      message: this.buildContent(message),
      errorMessage: this.buildContent(errorMessage),
      ...extraBuilded,
      location,
      match,
      navigate
    }

    if (Component.dontBuildContent) componentProps.content = content;
    const childrenHere = (
      (Array.isArray(childrenIn) ? childrenIn.join('-') : childrenIn)
      === (Array.isArray(section.name) ? section.name.join('-') : section.name)
    );
    if (!Component.dontBuildContent && content && childrenHere) {
      componentProps.children = React.createElement(React.Fragment, {},
        this.buildContent(content),
        children
      );
    } else if (!Component.dontBuildContent && content) {
      componentProps.children = this.buildContent(content);
    } else if (childrenHere) {
      componentProps.children = children;
    }

    const cnSection = [componentProps.name + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    if (this.props.wrapperClasses) cnSection.push(this.props.wrapperClasses);
    if (wrapperClasses) cnSection.push(wrapperClasses);

    const exclusionSec = excludeSectionWrapper.includes(componentName);

    const Wrapper = (componentProps.wrapper === false || Component.wrapper === false)
      ? false : componentProps.wrapper || Component.wrapper || 'section';

    if (!Wrapper || exclusionSec || componentProps.tag) {
      if (this.props.test) {
        if (!componentProps.style) componentProps.style = {};
        componentProps.style.border = '1px solid yellow';
      }
      return React.createElement(Component, { key: componentProps.name || i, ...componentProps })
    }

    return (React.createElement(Wrapper,
      {
        key: componentProps.name || i,
        className: cnSection.flat().join(' '),
        style: {
          "--component-name": `"${componentProps.name}"`,
          ...wrapperStyle
        }
      },
      React.createElement(Component, { ...componentProps })
    ));
  }

}