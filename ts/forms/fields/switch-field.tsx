import CheckboxField from "./checkbox-field";

export default class SwitchField extends CheckboxField {
  static override jsClass = "SwitchField";
  static override defaultProps = {
    ...CheckboxField.defaultProps,
    format: "switch",
  };
}
