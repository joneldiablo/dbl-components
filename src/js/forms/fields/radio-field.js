import React from "react";

import JsonRender from "../../json-render";
import Field from "./field";

export default class RadioField extends Field {

  static jsClass = 'RadioField';
  static defaultProps = {
    ...Field.defaultProps,
    inline: false,
    labelInline: true,
  }

  constructor(props) {
    super(props);
    const { mutations, ...propsRender } = props;
    this.jsonRender = new JsonRender(propsRender, mutations);
  }

  onChange(e) {
    const { value, dataset } = e.target;
    let setValue;
    switch (dataset.type) {
      case 'number':
        setValue = parseFloat(value);
        break;
      case 'boolean':
        setValue = value === 'true';
        break;
      default:
        setValue = value;
        break;
    }
    this.setState({
      value: setValue,
      error: this.isInvalid(setValue)
    }, () => this.returnData());
  }

  get type() {
    return 'radio';
  }

  get inputProps() {
    const props = super.inputProps;
    delete props.ref;
    delete props.className;
    return {
      ...props,
      className: 'form-check-input mx-2 p-0'
    }
  }

  nodeOption = (itemRaw, i) => {
    if (!itemRaw) return false;

    const { inline, name, labels: las, optionClasses, format, first } = this.props;
    const { value } = this.state;
    const modify = typeof this.props.mutations === 'function'
      && this.props.mutations(`${name}.${itemRaw.value}`, itemRaw);
    const item = Object.assign({}, itemRaw, modify || {});
    if (item.active === false) return false;

    const id = name + '-' + item.value;
    const labels = item.labels || las;
    const checked = (['boolean', 'number'].includes(typeof value)
      ? item.value === value
      : value.includes(item.value));
    const disabled = typeof item.disabled !== 'undefined'
      ? item.disabled : this.inputProps.disabled;
    const readOnly = typeof item.readOnly !== 'undefined'
      ? item.readOnly : this.inputProps.readOnly;

    const cn = [optionClasses, item.classes];
    if (inline) cn.push('form-check-inline');
    if (item.hidden && !checked) cn.push('visually-hidden-focusable');
    if (format === 'switch') cn.unshift('form-switch');
    else cn.unshift('form-check');

    const inputProps = {
      ...this.inputProps,
      disabled,
      readOnly,
      id,
      value: item.value === null ? "" : item.value,
      checked,
      'data-type': typeof item.value,
      style: {
        pointerEvents: readOnly ? 'none' : null,
        backgroundColor: readOnly ? 'transparent' : null
      }
    }
    const style = {};
    if (disabled) style['opacity'] = .5;
    const label = (labelIn) => React.createElement('label',
      { className: "form-check-label", htmlFor: id, style },
      labelIn
    );
    const theInput = labels.length === 2
      ? React.createElement(React.Fragment, {},
        label(this.jsonRender.buildContent(labels[0])),
        React.createElement('input', { ...inputProps }),
        label(this.jsonRender.buildContent(labels[1]))
      )
      : React.createElement('input', { ...inputProps });

    return React.createElement('div',
      {
        key: i + '-' + item.value,
        className: cn.flat().join(' '),
        style: { pointerEvents: readOnly ? 'none' : null }
      },
      first === 'label' && label(item.label),
      theInput,
      first === 'control' && label(item.label)
    )
  }

  content(children = this.props.children) {
    let { options, label, labelInline } = this.props;
    return React.createElement(React.Fragment, {},
      label && this.labelNode,
      !labelInline && React.createElement('br'),
      options.map(this.nodeOption).filter(o => !!o),
      React.createElement(React.Fragment, {},
        this.errorMessageNode,
        this.messageNode,
      ),
      children
    );
  }

}
