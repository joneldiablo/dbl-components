import React from "react";
import PropTypes from "prop-types";
import eventHandler from "../../functions/event-handler";
import Field from "./field";
import NoWrapField from "./no-wrap-field";


//TODO: al cambiar parpadea la validación o.O

export default class NewPasswordField extends Field {

  static jsClass = 'NewPasswordField';
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
    eventHandler.subscribe(`${this.props.name}-repeat`, this.onUpdateRepeat, this.unique);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    eventHandler.unsubscribe(`${this.props.name}-repeat`, this.unique);
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
    eventHandler.dispatch(`update.${this.props.name}-repeat`, { error: diff });
    return error;
  }

  content(children = this.props.children) {
    const { labelRepeat, placeholderRepeat, name,
      errorMessageRepeat, dividerClasses, inlineFields } = this.props;
    const cloneFieldProps = {
      ...this.props,
      name: name + '-repeat',
      type: this.type,
      label: labelRepeat,
      placeholder: placeholderRepeat,
      errorMessage: errorMessageRepeat,
      required: true
    };
    return inlineFields
      ? React.createElement('div', { className: "row" },
        React.createElement('div', { className: "col" },
          super.content(false)
        ),
        React.createElement('div', { className: "col" },
          React.createElement(NoWrapField, { ...cloneFieldProps })
        ),
        React.createElement('div', { className: "col-12" },
          children
        )
      )
      : React.createElement(React.Fragment, {},
        super.content(false),
        React.createElement('div', { className: dividerClasses }),
        React.createElement(NoWrapField, { ...cloneFieldProps }),
        children
      );
  }

};