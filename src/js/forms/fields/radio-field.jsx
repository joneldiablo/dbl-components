import React from "react";
import PropTypes from "prop-types";
import Field from "./field";

export default class RadioField extends Field {

  static propTypes = {
    ...Field.propTypes,
    inline: PropTypes.bool
  }

  static defaultProps = {
    ...Field.defaultProps,
    type: 'radio',
    inline: false
  }

  onChange(e) {
    let { checked, value } = e.target;
    if (!checked) return;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    this.setState({
      value,
      error: this.isInvalid(value)
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
    const { inline, name } = this.props;
    const { value } = this.state;
    const cn = ['form-check'];
    if (inline) cn.push('form-check-inline');
    const id = name + '-' + item.value;
    return <div key={i + '-' + item.value} className={cn.join(' ')}>
      <input {...this.inputProps} id={id} value={item.value} checked={value === item.value} />
      <label className="form-check-label" htmlFor={id}>{item.label}</label>
    </div>
  }

  content() {
    let { options, errorMessage, label } = this.props;
    let { error } = this.state;
    return <>
      {label && this.nodeLabel}
      {options.map(this.nodeOption)}
      {error && <small className="text-danger">
        {errorMessage}
      </small>}
    </>
  }

}
