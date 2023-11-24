import React from "react";
import Field from "./field";

export default class RadioField extends Field {

  static jsClass = 'RadioField';
  static defaultProps = {
    ...Field.defaultProps,
    inline: false,
    labelInline: true,
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
      className: 'form-check-input'
    }
  }

  nodeOption = (item, i) => {
    const { inline, name, format, first } = this.props;
    const { value } = this.state;
    const cn = ['form-check', item.classes];
    if (inline) cn.push('form-check-inline');
    const id = name + '-' + item.value;
    const checked = (['boolean', 'number'].includes(typeof value) ?
      item.value === value :
      value.includes(item.value));
    if (item.hidden && !checked) cn.push('visually-hidden-focusable');
    if (format === 'switch') cn.push('form-switch');
    const disabled = typeof item.disabled !== 'undefined'
      ? item.disabled : this.inputProps.disabled;
    const readOnly = typeof item.readOnly !== 'undefined'
      ? item.readOnly : this.inputProps.readOnly;
    const inputProps = {
      ...this.inputProps,
      disabled,
      readOnly,
      id,
      value: item.value === null ? "" : item.value,
      checked: checked,
      'data-type': typeof item.value,
      style: {
        pointerEvents: readOnly ? 'none' : null,
        backgroundColor: readOnly ? 'transparent' : null
      }
    }
    const style = {};
    if (disabled) style['opacity'] = .5;
    const label = React.createElement('label',
      { className: "form-check-label", htmlFor: id, style },
      item.label);
    return React.createElement('div',
      {
        key: i + '-' + item.value,
        className: cn.join(' '),
        style: { pointerEvents: readOnly ? 'none' : null }
      },
      first === 'label' && label,
      React.createElement('input', { ...inputProps }),
      first === 'control' && label
    )
  }

  content(children = this.props.children) {
    let { options, errorMessage, label, labelInline } = this.props;
    let { error } = this.state;
    return React.createElement(React.Fragment, {},
      label && this.labelNode,
      !labelInline && React.createElement('br'),
      options.map(this.nodeOption),
      children,
      error && React.createElement('small',
        { className: "text-danger" },
        errorMessage
      )
    );
  }

}