import React from "react";
import Field from "./field";

export default class RadioField extends Field {

  static jsClass = 'RadioField';
  static defaultProps = {
    ...Field.defaultProps,
    inline: false
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
    const { inline, name, format } = this.props;
    const { value } = this.state;
    const cn = ['form-check', item.classes];
    if (inline) cn.push('form-check-inline');
    const id = name + '-' + item.value;
    const checked = (['boolean', 'number'].includes(typeof value) ?
      item.value === value :
      value.includes(item.value));
    if (item.hidden && !checked) cn.push('visually-hidden-focusable');
    if (format === 'switch') cn.push('form-switch');
    const inputProps = {
      disabled: item.disabled,
      readOnly: item.readOnly,
      ...this.inputProps,
      id,
      value: item.value === null ? "" : item.value,
      checked: checked,
      'data-type': typeof item.value
    }
    return <div key={i + '-' + item.value} className={cn.join(' ')} >
      <input {...inputProps} />
      <label className="form-check-label" htmlFor={id}>{item.label}</label>
    </div >
  }

  content() {
    let { options, errorMessage, label } = this.props;
    let { error } = this.state;
    return <>
      {label && this.labelNode}
      {options.map(this.nodeOption)}
      {error && <small className="text-danger">
        {errorMessage}
      </small>}
    </>
  }

}
