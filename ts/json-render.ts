import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import parseReact, { domToReact, attributesToProps } from 'html-react-parser';
import { hash, t, formatValue, deepMerge } from 'dbl-utils';
import Icons from './media/icons';
import COMPONENTS from './components';

const excludeSectionWrapper = [
  'NavLink',
  'Image',
  'Link',
  'Icons',
  'SvgImports',
  'Action',
  'DropdownButtonContainer',
  'ModalButtonContainer',
  'DropdownItem'
];

export function addExclusions(exclusion: string | string[]): void {
  excludeSectionWrapper.push(...[exclusion].flat());
}

export default class JsonRender {
  parseOpts: any;
  actualSections: any[] = [];
  props: any;
  mutations: any;
  childrenIn?: boolean | string;

  constructor(props: any, mutations: any) {
    this.props = props;
    this.mutations = mutations;
    this.sections = this.sections.bind(this);
    this.buildContent = this.buildContent.bind(this);

    this.parseOpts = {
      replace: (domNode: any) => {
        let C7tReplace: React.ElementType | undefined;
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
        Object.keys(domNode).forEach((k) => {
          if (/^on[A-Z]/.test(k)) {
            domNode[k] = this.props[k];
          }
        });
        return React.createElement(
          C7tReplace as any,
          { ...attributesToProps(domNode.attribs) },
          domToReact(domNode.children, this.parseOpts)
        );
      }
    };
  }

  buildContent(content: any, index = 0): React.ReactNode | boolean {
    if (!content) return false;
    if (typeof content !== 'object') {
      const translate = t(content, this.props.context);
      const section = this.actualSections[this.actualSections.length - 1];
      if (typeof translate === 'number' || typeof translate === 'boolean') {
        return formatValue(translate, section);
      } else if (typeof translate === 'string') {
        let parsed: any = parseReact(translate, this.parseOpts);
        if (typeof parsed === 'string') parsed = formatValue(parsed, section);
        return React.createElement(
          React.Fragment,
          {
            key: [index || '0', section?.name, hash(translate)].filter(Boolean).join('-')
          },
          parsed
        );
      }
    } else if (React.isValidElement(content)) {
      try {
        (content as any).key = (content as any).key || (content as any).props.name || index;
      } catch {
        /* ignore */
      }
      return content;
    } else if (Array.isArray(content)) return content.map((c, i) => this.buildContent(c, i)) as any;
    if (Array.isArray(content.name)) content.name = content.name.join('-');
    if (typeof content === 'object' && typeof content.name !== 'string')
      return Object.keys(content).map((name, i) =>
        this.buildContent(
          typeof content[name] !== 'object'
            ? content[name]
            : { name, ...content[name] },
          i
        )
      ) as any;
    this.actualSections.push(content);
    const builded = this.sections(content, index);
    this.actualSections.pop();
    return builded;
  }

  sections(sr: any, i: number): React.ReactElement | boolean {
    const m =
      (typeof this.mutations === 'function' && this.mutations(sr.name, sr)) || {};
    if (m.style && sr.style) m.style = deepMerge({}, sr.style, m.style);
    if (m._props && sr._props) m._props = deepMerge({}, sr._props, m._props);
    const sectionRaw = Object.assign({}, sr, m || {});
    if (sectionRaw.active === false) return false;

    const {
      component: componentName,
      content,
      placeholder,
      label,
      message,
      errorMessage,
      managerName,
      wrapperClasses,
      wrapperStyle = {},
      ...section
    } = sectionRaw;
    const {
      navigate,
      location,
      match,
      childrenIn = (this as any).childrenIn,
      children
    } = this.props;
    const Component = (COMPONENTS as any)[componentName] || (COMPONENTS as any).Component;
    const extraBuilded = [Component.slots]
      .flat()
      .filter(Boolean)
      .reduce((eb: any, key: string) => {
        const tmp = section[key];
        section[key] = null;
        delete section[key];
        eb[key] = this.buildContent(tmp);
        return eb;
      }, {} as Record<string, any>);
    const componentProps: any = {
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
    };

    if (Component.dontBuildContent) componentProps.content = content;
    const childrenHere =
      (Array.isArray(childrenIn) ? childrenIn.join('-') : childrenIn) ===
      (Array.isArray(section.name) ? section.name.join('-') : section.name);
    if (!Component.dontBuildContent && content && childrenHere) {
      componentProps.children = React.createElement(
        React.Fragment,
        {},
        this.buildContent(content),
        children
      );
    } else if (!Component.dontBuildContent && content) {
      componentProps.children = this.buildContent(content);
    } else if (childrenHere) {
      componentProps.children = children;
    }

    const cnSection = [(componentProps.name as string) + '-section'];
    if (this.props.test) cnSection.push('test-section-wrapper');
    if (this.props.wrapperClasses) cnSection.push(this.props.wrapperClasses);
    if (wrapperClasses) cnSection.push(wrapperClasses);

    const exclusionSec = excludeSectionWrapper.includes(componentName);

    const Wrapper =
      componentProps.wrapper === false || Component.wrapper === false
        ? false
        : componentProps.wrapper || Component.wrapper || 'section';

    if (!Wrapper || exclusionSec || componentProps.tag) {
      if (this.props.test) {
        if (!componentProps.style) componentProps.style = {};
        componentProps.style.border = '1px solid yellow';
      }
      return React.createElement(Component as any, {
        key: componentProps.name || i,
        ...componentProps
      });
    }

    return React.createElement(
      Wrapper as any,
      {
        key: componentProps.name || i,
        className: cnSection.flat().join(' '),
        style: {
          '--component-name': `"${componentProps.name}"`,
          ...wrapperStyle
        }
      },
      React.createElement(Component as any, { ...componentProps })
    );
  }
}
