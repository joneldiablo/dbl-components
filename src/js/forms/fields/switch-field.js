import React from "react";

import JsonRender from "../../json-render";
import CheckboxField from "./checkbox-field";

export default class SwitchField extends CheckboxField {

  static jsClass = 'SwitchField';
  static defaultProps = {
    ...CheckboxField.defaultProps,
    labels: []
  }

  constructor(props) {
    super(props);
    this.jsonRender = new JsonRender(props);
  }

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
    const theInput = this.props.labels.length === 2 ?
      React.createElement(React.Fragment, {},
        this.jsonRender.buildContent(labels[0]),
        React.createElement('input', { ...inputProps }),
        this.jsonRender.buildContent(labels[1])
      ) :
      React.createElement('input', { ...inputProps })

    return React.createElement('div',
      { key: i + '-' + item.value, className: cn.join(' ') },
      item.label && React.createElement(React.Fragment, {},
        React.createElement('label',
          { className: "form-check-label", htmlFor: id },
          item.label
        ),
        !(this.props.inline || item.inline) && React.createElement('br')
      ),
      theInput
    )
  }

}
