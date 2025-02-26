import React from "react";
import PropTypes from "prop-types";

import Field from "./field";

export default class DropFileField extends Field {

  static jsClass = 'DropFileField';
  static propTypes = {
    ...Field.propTypes,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state.localClasses = 'card';
    this.state.files = [];
  }

  onChange(e) {
    // TODO: arreglar el asunto de contenido inside, 
    // si se quita el archivo, no se retorna data
    // quizá se resolvería con permitir setear onInvalid
    const { value, files } = e.target;
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.delete('active');
    lc.delete('filled');
    lc.delete('border-danger');
    const error = this.isInvalid(value);
    if (error) lc.add('border-danger');
    if (files.length) lc.add('filled');
    let filesArr = Array.from(files);
    this.setState({
      value: filesArr.map(f => f.name).join(', '),
      valueInput: value,
      files: filesArr,
      error,
      localClasses: Array.from(lc).flat().join(' ')
    }, () => this.returnData(filesArr));
  }

  onInvalid(e) {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.delete('active');
    lc.delete('filled');
    lc.add('border-danger');
    this.setState({
      error: true,
      localClasses: Array.from(lc).flat().join(' ')
    });
  }

  onDragover = () => {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.add('active');
    lc.delete('filled');
    lc.delete('border-danger');
    this.setState({ localClasses: Array.from(lc).flat().join(' ') });
  }

  onDragleave = () => {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.delete('active');
    this.setState({ localClasses: Array.from(lc).flat().join(' ') });
  }

  onUpdate(update) {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.delete('active');
    const newState = {};
    if (typeof update.value !== 'undefined' && update.value !== null) {
      if (!update.value.length) {
        lc.delete('filled');
      } else {
        lc.add('filled');
      }
      newState.files = update.value;
    }
    if (update.reset) {
      if (!newState.length) {
        lc.delete('filled');
      } else {
        lc.add('filled');
      }
      newState.files = this.props.default || [];
    }
    newState.localClasses = Array.from(lc).flat().join(' ');
    this.setState(newState);
    super.onUpdate(update);
  }

  get type() {
    return 'file';
  }

  get inputProps() {
    const props = super.inputProps;
    const { accept, multiple } = this.props;
    const { valueInput, value } = this.state;
    props.value = !!(value?.length) ? valueInput : value;
    props.accept = accept;
    props.multiple = multiple;
    props.onDragOver = this.onDragover;
    props.onDragLeave = this.onDragleave;
    props.onDrop = this.onDragleave;
    props.style = {
      opacity: 0,
      position: 'absolute',
      width: '100%',
      top: 0,
      left: 0,
      height: '100%',
      cursor: 'pointer'
    };
    return props;
  }
  content(children = this.props.children) {
    const { label } = this.props;
    const { value } = this.state;
    return React.createElement('div',
      { className: "card-body" },
      (!value && label) && this.labelNode,
      children && (!value ? children[0] : (children[1] || value)),
      this.inputNode,
      React.createElement('div', {}, this.errorMessageNode),
      (!children && value) && React.createElement('p', {}, value)
    )
  }
}