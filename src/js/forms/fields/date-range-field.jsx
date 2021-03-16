import React from "react";
import Field from "./field";
import moment from "moment";

export default class DateRangeField extends Field {

  /*  static propTypes = {
     ...Field.propTypes
   }
 
   static defaultProps = {
     ...Field.defaultProps,
     type: 'select'
   };
 */
  constructor(props) {
    super(props);
    this.state.value = Array.isArray(props.value) ? props.value :
      (Array.isArray(props.default) ? props.default : []);
  }

  isInvalid(value) {
    let error = super.isInvalid(value);
    if (!error) {
      error = moment(value[0]).isAfter(value[1]);
    }
    return error;
  }

  get type() {
    return 'date';
  }

  onChange({ target }) {
    const { name } = this.props;
    const { value } = this.state;
    const { value: newValue } = target;
    const i = target.name === name ? 0 : 1;
    value[i] = newValue;
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => { if (value.every(v => !!v)) this.returnData() });
  }

  get inputNode() {
    const { inline } = this.props;
    const { error } = this.state;
    const inputProps = this.inputProps;
    const cnMiddle = ['input-group-text bg-transparent p-0'];
    if (error) cnMiddle.push('border-danger');
    const inputNode = (<div className="input-group">
      <input {...inputProps} style={{
        ...inputProps.style,
        borderRight: 'none',
      }} value={inputProps.value[0]} />
      <span className={cnMiddle.join(' ')} >-</span>
      <input {...inputProps} name={inputProps.name + '-end'} id={inputProps.name + '-end'} style={{
        ...inputProps.style,
        borderLeft: 'none'
      }} value={inputProps.value[1]} />
    </div>);
    return (inline ? <div className="col-auto">
      {inputNode}
      {this.errorMessageNode}
    </div> : inputNode);
  }

}
