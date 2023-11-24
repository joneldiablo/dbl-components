import React from "react";
import parseReact from "html-react-parser";

import { CKEditor } from '@ckeditor/ckeditor5-react';

import eventHandler from "../../functions/event-handler";
import Field from "./field";

export default class EditorField extends Field {

  static jsClass = 'EditorField';
  static defaultProps = {
    ...Field.defaultProps,
    editor: null,
    config: {}
  }

  config = {}

  onChange(event, editor) {
    const value = editor.getData();
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => this.returnData());
  }

  onReady = (editor) => {
    const documentView = editor.editing.view.document;
    const controller = this;
    documentView.on('paste', (event, data) =>
      eventHandler.dispatch('paste.' + controller.props.name, { [this.props.name]: { event, data } })
    );
  }

  get inputNode() {
    const { config, editor } = this.props;
    const { value } = this.state;
    const { disabled } = this.inputProps;
    const attrs = {
      editor,
      data: value,
      config: Object.assign({}, this.config, config),
      onReady: this.onReady,
      onChange: this.onChange,
      onBlur: (event, editor) => eventHandler.dispatch('blur.' + this.props.name, editor),
      onFocus: (event, editor) => eventHandler.dispatch('focus.' + this.props.name, editor)
    };
    return disabled
      ? React.createElement('div',
        { className: "form-control text-reset" },
        parseReact(value)
      )
      : !!editor ? React.createElement(CKEditor, { ...attrs }) : 'No editor found'
  }
}