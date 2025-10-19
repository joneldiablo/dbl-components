import CheckboxField from "./checkbox-field";

/**
 * Checkbox variant that renders Bootstrap switch controls.
 *
 * @example
 * ```tsx
 * <SwitchField
 *   name="notifications"
 *   label="Receive notifications"
 *   options={[{ label: "Enabled", value: true }]}
 * />
 * ```
 */
export default class SwitchField extends CheckboxField {
  static override jsClass = "SwitchField";
  static override defaultProps = {
    ...CheckboxField.defaultProps,
    format: "switch",
  };
}
