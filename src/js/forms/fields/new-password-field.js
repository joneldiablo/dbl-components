import React from "react";
import PropTypes from "prop-types";

import { eventHandler } from "dbl-utils";

import JsonRender from "../../json-render";
import Field from "./field";
import NoWrapField from "./no-wrap-field";


//TODO: al cambiar parpadea la validación o.O

export default class NewPasswordField extends Field {

  static jsClass = 'NewPasswordField';
  static propTypes = {
    ...Field.propTypes,
    labelRepeat: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    placeholderRepeat: PropTypes.string,
    dividerClasses: PropTypes.string,
    patterns: PropTypes.arrayOf(PropTypes.shape({
      pattern: PropTypes.string,
      errorMessage: PropTypes.string
    })),
    mutations: PropTypes.func
  }
  static defaultProps = {
    ...Field.defaultProps,
    dividerClasses: 'mb-3'
  }

  constructor(props) {
    super(props);
    const { mutations, ...jProps } = props;
    this.jsonRender = new JsonRender(jProps, mutations);
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

  get errorMessageNode() {
    const { errorMessage: em, patterns } = this.props;
    const { error, value } = this.state;
    if (!error && !errorMessage || !patterns) return false;
    const errorMessage = !patterns ? [em] : [
      em, React.createElement('ul', {},
        ...Object.entries(patterns)
          .map(([k, { pattern, errorMessage }]) => !value.match(pattern)
            && <li>{this.jsonRender.buildContent(errorMessage)}</li>)
          .filter(p => !!p))
    ];
    const errorNode = React.createElement('div', { className: "m-1 lh-1" },
      React.createElement('small', { className: "text-danger" },
        ...errorMessage
      )
    );
    return errorNode;
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