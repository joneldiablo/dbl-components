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

  onUpdate(params) {
    if (params.value) return;
    super.onUpdate({...params});
  }

}
