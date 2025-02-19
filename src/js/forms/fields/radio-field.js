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


  get type() {
    return 'radio';
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

  get inputProps() {
    const props = super.inputProps;
    delete props.ref;
    delete props.className;
    let className = 'form-check-input';
    if (this.props.format === 'button') className = 'btn-check';
    return {
      ...props,
      className
    }
  }

  nodeOption = (itemRaw, i) => {
    if (!itemRaw) return false;

    const { inline, name, labels: las, optionClasses, format, labelClasses } = this.props;
    let { first } = this.props;
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
    else if (format === 'button') {
      cn.unshift('');
      first = 'control';
    } else cn.unshift('form-check');

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
    const lc = [
      format === 'button' ? 'btn' : "form-check-label",
      labelClasses,
      item.labelClasses
    ];
    const label = (labelIn) => React.createElement('label',
      { className: lc.flat().join(' '), htmlFor: id, style },
      labelIn
    );
    const theInput = Array.isArray(labels)
      ? React.createElement(React.Fragment, {},
        label(this.jsonRender.buildContent(labels[0])),
        React.createElement('input', { ...inputProps }),
        label(this.jsonRender.buildContent(labels[1]))
      )
      : React.createElement('input', { ...inputProps });

    return React.createElement('div',
      {
        key: i + '-' + item.value,
        className: cn.filter(c => !!c).flat().join(' '),
        style: { pointerEvents: readOnly ? 'none' : null }
      },
      first === 'label' && label(this.jsonRender.buildContent(item.label)),
      theInput,
      first === 'control' && label(this.jsonRender.buildContent(item.label))
    )
  }

  content(children = this.props.children) {
    let { options, label, labelInline } = this.props;
    const hasOptions = Array.isArray(options);
    return React.createElement(React.Fragment, {},
      !!label && hasOptions && this.labelNode,
      !!label && hasOptions && !labelInline && React.createElement('br'),
      options.map(this.nodeOption).filter(o => !!o),
      React.createElement(React.Fragment, {},
        this.errorMessageNode,
        this.messageNode,
      ),
      children
    );
  }

}
