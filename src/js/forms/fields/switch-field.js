import CheckboxField from "./checkbox-field";

export default class SwitchField extends CheckboxField {

  static jsClass = 'SwitchField';

  static defaultProps = {
    ...CheckboxField.defaultProps,
    format: 'switch'
  }

}
