import React from "react";
import Field from "./field";

export default class FileField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    multiple: false,
    format: 'base64'
  }

  static jsClass = 'FileField';

  get type() {
    return 'file';
  }

  async onChange(e) {
    let { value, files } = e.target;
    const arrayFiles = Array.from(files);
    this.setState({
      value,
      error: this.isInvalid(value)
    });
    if (!arrayFiles.length) return this.returnData(null);
    const p6s = arrayFiles.map(file => this.readAs(file, this.props.format));
    const final = await Promise.all(p6s);
    if (this.props.multiple) {
      this.returnData(final);
    } else {
      this.returnData(final[0]);
    }
  }

  readAs(file, format = 'base64') {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      switch (format) {
        case 'base64':
          reader.readAsDataURL(file);
          break;
        case 'text':
          reader.readAsText(file);
          break;
        case 'binaryString':
          reader.readAsBinaryString(file);
          break;
        default:
          break;
      }
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  get inputProps() {
    const ip = super.inputProps;
    ip.required = ip.required && !(this.state.value);
    delete ip.value;
    return ip;
  }

  get inputNode() {
    const { inline, disabled, readOnly } = this.props;
    const { value } = this.state;
    const inputNode = (<>
      {!(value && (disabled || readOnly)) && <input {...this.inputProps} />}
      {value && (disabled || readOnly) && <p className="form-control mb-1">
        <a href={value} target="_blank">
          {value.split(/[\/\\]/).pop().split('?')[0]}
        </a>
      </p>}
      {value && !(disabled || readOnly) && <p className="text-end my-1">
        <small><a href={value} target="_blank">
          {value.split(/[\/\\]/).pop().split('?')[0]}
        </a></small>
      </p>}
    </>);
    return (inline ? <div className="col-auto">
      {inputNode}
    </div> : inputNode);
  }

}
