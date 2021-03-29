import React from "react";
import RadioField from "./radio-field";

export default class CheckboxField extends RadioField {

  static jsClass = 'CheckboxField';

  get type() {
    return 'checkbox';
  }

  onChange(e) {
    const { checked, value, dataset } = e.target;
    const { options } = this.props;
    let { value: setValue } = this.state;
    if (Array.isArray(options)) {
      setValue = Array.isArray(setValue) ? setValue : [];
      const valueSet = new Set(setValue);
      const typeOfValue = dataset.type === 'number' ? parseFloat(value) : value;
      if (checked) valueSet.add(typeOfValue);
      else valueSet.delete(typeOfValue);
      setValue = Array.from(valueSet);
    } else {
      setValue = checked;
    }
    this.setState({
      value: setValue,
      error: this.isInvalid(setValue)
    }, () => this.returnData());
  }

  get inputProps() {
    const props = super.inputProps;
    props.required = (this.props.required && !this.state.value.length);
    return props;
  }

  content() {
    let { options, errorMessage, label } = this.props;
    let { error } = this.state;
    return <>
      {label && this.nodeLabel}
      {Array.isArray(options) ?
        options.map(this.nodeOption) :
        // se inserta el valor true para no modificar el algoritmo de nodeOption en el padre
        this.nodeOption({ value: true, label })}
      {error && <small className="text-danger">
        {errorMessage}
      </small>}
    </>
  }

}
