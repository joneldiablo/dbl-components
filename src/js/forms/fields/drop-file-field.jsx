import React from "react";
import Field from "./field";
export default class DropFileField extends Field {

  static jsClass = 'DropFileField';

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
      files: filesArr,
      error,
      localClasses: Array.from(lc).join(' ')
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
      localClasses: Array.from(lc).join(' ')
    });
  }

  onDragover = () => {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.add('active');
    lc.delete('filled');
    lc.delete('border-danger');
    this.setState({ localClasses: Array.from(lc).join(' ') });
  }

  onDragleave = () => {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.delete('active');
    this.setState({ localClasses: Array.from(lc).join(' ') });
  }

  onUpdate(update) {
    const { localClasses } = this.state;
    const lc = new Set(localClasses.split(' '));
    lc.delete('active');
    if (!(update.value?.length)) {
      lc.delete('filled');
    } else {
      lc.add('filled');
    }
    this.setState({
      localClasses: Array.from(lc).join(' ')
    });
    super.onUpdate(update);
  }

  get type() {
    return 'file';
  }

  get inputProps() {
    const props = super.inputProps;
    const { accept, multiple } = this.props;
    delete props.value;
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
    return <div className="card-body">
      {(!value && label) && this.labelNode}
      {children && (!value ? children[0] : children[1])}
      {this.inputNode}
      <div>{this.errorMessageNode}</div>
      {(!children && value) && <p>{value}</p>}
    </div>
  }
}