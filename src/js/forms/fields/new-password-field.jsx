import React from "react";
import Field from "./field";
import NakedField from "./naked-field";

export default class NewPasswordField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    type: 'password'
  }

  state = {
    value: this.props.value || this.props.default,
    error: false
  }

  get type() {
    return 'password';
  }

  comparePass = (data) => {
    const { name } = this.props;
    const { value } = this.state;
    if (value === data[name + '-repeat'])
      this.returnData();
  }

  content(children = this.props.children) {
    const { labelRepeat, placeholderRepeat, name } = this.props;
    const { value } = this.state;
    const cloneFieldProps = {
      name: name + '-repeat',
      type: this.type,
      label: labelRepeat,
      placeholder: placeholderRepeat,
      required: true,
      onChange: this.comparePass,
      isInvalid: (valueIn) => value !== valueIn
      //TODO: quitar esto, el pattern es visible, problema de seguridad!!!
      //pattern: `^${value}$`
    };
    return <>
      {super.content(false)}
      <div className="mb-3"></div>
      <NakedField {...cloneFieldProps} />
      {children}
    </>
  }

};