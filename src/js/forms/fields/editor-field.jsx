import React from "react";
import parseReact from "html-react-parser";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import eventHandler from "../../functions/event-handler";
import Field from "./field";

export default class EditorField extends Field {

  static jsClass = 'EditorField';
  static defaultProps = {
    ...Field.defaultProps,
    config: {
      toolbar: ['heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'undo',
        'redo']
    }
  }

  editorType = ClassicEditor;

  onChange(event, editor) {
    const value = editor.getData();
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => this.returnData());
  }

  get inputNode() {
    const { config } = this.props;
    const { value } = this.state;
    const { disabled } = this.inputProps;
    return disabled ?
      <div className="form-control text-reset">
        {parseReact(value)}
      </div> :
      <CKEditor
        editor={this.editorType}
        data={value}
        config={Object.assign({}, this.config, config)}
        onReady={editor => {
          this.editor = editor;
        }}
        onChange={this.onChange}
        onBlur={(event, editor) => {
          eventHandler.dispatch('blur.' + this.props.name, editor);
        }}
        onFocus={(event, editor) => {
          eventHandler.dispatch('focus.' + this.props.name, editor);
        }}
      />
  }
}