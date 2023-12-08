import React from "react";
import Field from "./field";
import bytes from "bytes";
import * as LZMAObj from 'lzma/src/lzma_worker';

import eventHandler from "../../functions/event-handler";

export default class FileField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    multiple: false,
    format: 'base64',
    zip: false
  }

  static jsClass = 'FileField';

  constructor(props) {
    super(props);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    if (props.hidden)
      this.state.localClasses = 'cursor-pointer';
  }

  get componentProps() {
    const _props = this.props._props;
    return {
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
      ..._props
    }
  }

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses('drag-over');
  }

  onDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    this.addClasses('drag-over');
  }

  onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses('drag-over');
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses('drag-over');
    const dt = e.dataTransfer;
    const files = dt.files;
    this.input.current.files = files;
    this.onChange({
      target: this.input.current
    });
  }

  get type() {
    return 'file';
  }

  isInvalid(value) {
    if (this.props.maxSize && this.input.current?.files) {
      const files = Array.from(this.input.current.files);
      const error = files.some(file => file.size > bytes(this.props.maxSize, { unit: 'B' }));
      if (error) {
        this.input.current.setCustomValidity(this.props.errorMessage);
        return true;
      }
    }
    return super.isInvalid(value);
  }

  async onChange(e) {
    let { value, files } = e.target;
    const arrayFiles = Array.from(files);
    const newState = {
      value: [],
      error: this.isInvalid(value)
    }
    this.setState(newState);
    if (!arrayFiles.length || newState.error) return this.returnData(null);

    const p6s = arrayFiles.map(async file => {
      const readFile = await this.readAs(file, this.props.format);
      newState.value.push({
        name: file.name,
        file: readFile
      });
      return readFile;
    });
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
        case 'zip':
          reader.readAsArrayBuffer(file);
          break;
        default:
          break;
      }
      const onFinish = (result, error) => {
        eventHandler.dispatch('zipping.' + this.props.name, { [this.props.name]: 'end' });
        if (error) return reject(error);
        resolve(result);
      };
      const onPercentage = (percentage) =>
        eventHandler.dispatch('zipping.' + this.props.name, { [this.props.name]: percentage });
      reader.onload = () => {
        if (this.props.format !== 'zip') return resolve(reader.result);
        eventHandler.dispatch('zipping.' + this.props.name, { [this.props.name]: 'start' });
        const array = new Uint8Array(reader.result);
        const mode = this.props.zip || 9;
        LZMAObj.LZMA.compress(array, mode, onFinish, onPercentage);
      };
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
    const links = (Array.isArray(value) ? value : [value])
      .map(l => {
        if (typeof l === 'string') {
          return React.createElement('a',
            { href: l, target: "_blank", className: '' },
            l.split(/[\/\\]/).pop().split('?')[0]
          )
        } else {
          return React.createElement('span',
            { name: l.name, classes: '' },
            l.name
          )
        }
      });

    const inputNode = React.createElement(React.Fragment, {},
      !(value && (disabled || readOnly))
        ? React.createElement('input', { ...this.inputProps })
        : React.createElement('p',
          { className: "form-control mb-1 disabled" },
          ...links
        ),
      value && !(disabled || readOnly) &&
      React.createElement('p',
        { className: "text-end my-1" },
        React.createElement('small', {},
          ...links
        )
      )
    );
    return (inline
      ? React.createElement('div', { className: "col-auto" }, inputNode)
      : inputNode);
  }

}
