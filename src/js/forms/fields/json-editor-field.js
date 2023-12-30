import Field from "./field";


export default class extends Field {

  static jsClass = 'JsonEditorField';

  get inputProps() {
    const { disabled, readOnly, accept, minLength,
      required, name, controlClasses, maxLength,
      placeholder, step, noValidate, multiple,
      min, max, pattern, autoComplete, dir } = this.props;
    const { value, error } = this.state;
    const cn = [
      'svelte-jsoneditor',
      controlClasses, error ? 'is-invalid' : ''
    ];
    return {
      id: name, name,
      /* pattern, placeholder,
      required, autoComplete, type: this.type,*/
      value, className: cn.flat().join(' '),
      /* min, max, step, noValidate, disabled,
      readOnly, */ ref: this.input,/*  dir, accept,
      multiple, maxLength, minLength,
      onChange: this.onChange,
      onInvalid: this.onInvalid,
      onFocus: this.onFocus */
    }
  }

  get inputNode() {
    const inputNode = (React.createElement('div', {}, 'SIN TERMINAR XP'));
    return inputNode;
  }

}
