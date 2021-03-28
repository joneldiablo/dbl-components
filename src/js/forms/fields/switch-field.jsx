import React from "react";
import CheckboxField from "./checkbox-field";

export default class SwitchField extends CheckboxField {

  nodeOption = (item, i) => {
    const { name, labels, optionClasses, disabled } = this.props;
    const { value } = this.state;
    const cn = ['form-switch p-0', optionClasses, item.classes];
    const id = name + '-' + item.value;
    const checked = (['boolean', 'number'].includes(typeof value) ?
      item.value === value :
      value.includes(item.value));
    if (item.hidden && !checked) cn.push('visually-hidden-focusable');
    const inputProps = {
      ...this.inputProps,
      className: 'form-check-input mx-2 p-0',
      id,
      value: item.value,
      checked: checked,
      disabled: item.disabled || disabled,
      'data-type': typeof item.value
    }
    return <div key={i + '-' + item.value} className={cn.join(' ')} >
      <label className="form-check-label" htmlFor={id}>{item.label}</label>
      <br />
      {labels[0]}<input {...inputProps} />{labels[1]}
    </div>
  }

}
