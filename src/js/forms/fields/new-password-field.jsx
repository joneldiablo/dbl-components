import React from "react";
import PropTypes from "prop-types";
import eventHandler from "../../functions/event-handler";
import Field from "./field";
import NoWrapField from "./no-wrap-field";


//TODO: al cambiar parpadea la validación o.O

export default class NewPasswordField extends Field {

  static propTypes = {
    ...Field.propTypes,
    labelRepeat: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    placeholderRepeat: PropTypes.string,
    dividerClasses: PropTypes.string
  }

  static defaultProps = {
    ...Field.defaultProps,
    dividerClasses: 'mb-3'
  }

  get type() {
    return 'password';
  }

  componentDidMount() {
    super.componentDidMount();
    eventHandler.subscribe(`${this.props.name}-repeat-NoWrapField`, this.onUpdateRepeat, this.unique);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    eventHandler.unsubscribe(`${this.props.name}-repeat-NoWrapField`, this.unique);
  }

  returnData(value = this.state.value, valueRepeat = this.state.valueRepeat) {
    if (value === valueRepeat) super.returnData(value);
  }

  onUpdateRepeat = (data) => {
    this.setState(
      { valueRepeat: data[this.props.name + '-repeat'] },
      () => !this.isInvalid() && this.returnData()
    );
  }

  isInvalid(value = this.state.value, valueRepeat = this.state.valueRepeat) {
    const error = super.isInvalid(value);
    const diff = (value !== valueRepeat);
    eventHandler.dispatch(`update.${this.props.name}-repeat-NoWrapField`, { error: diff });
    return error;
  }

  content(children = this.props.children) {
    const { labelRepeat, placeholderRepeat, name,
      errorMessageRepeat, dividerClasses } = this.props;
    const cloneFieldProps = {
      ...this.props,
      name: name + '-repeat',
      type: this.type,
      label: labelRepeat,
      placeholder: placeholderRepeat,
      errorMessage: errorMessageRepeat,
      required: true
    };
    return <>
      {super.content(false)}
      <div className={dividerClasses}></div>
      <NoWrapField {...cloneFieldProps} />
      {children}
    </>
  }

};