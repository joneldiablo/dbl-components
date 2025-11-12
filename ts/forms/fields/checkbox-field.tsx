import React from "react";

import RadioField, {
  type RadioFieldOption,
  type RadioFieldProps,
} from "./radio-field";

type CheckboxValue = boolean | Array<string | number | boolean>;

/**
 * Props accepted by {@link CheckboxField}.
 *
 * @example
 * ```tsx
 * <CheckboxField
 *   name="acceptTerms"
 *   label="Accept the terms"
 *   options={[
 *     { label: "Yes", value: true },
 *   ]}
 * />
 * ```
 */
export interface CheckboxFieldProps extends RadioFieldProps {
  options?: RadioFieldOption[];
}

/**
 * Checkbox implementation built on top of {@link RadioField} to support boolean and
 * multi-select lists of values.
 *
 * @example
 * ```tsx
 * <CheckboxField
 *   name="colorFilters"
 *   label="Pick colors"
 *   options={[
 *     { label: "Red", value: "red" },
 *     { label: "Green", value: "green" },
 *   ]}
 *   required
 * />
 * ```
 */
export default class CheckboxField extends RadioField {
  declare props: CheckboxFieldProps;

  static override jsClass = "CheckboxField";

  override get type(): string {
    return "checkbox";
  }

  override onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void {
    const { checked, value, dataset } = e.target as HTMLInputElement;
    const { options } = this.props;
    let setValue: CheckboxValue = this.state.value as CheckboxValue;
    if (Array.isArray(options)) {
      const normalized = Array.isArray(setValue) ? [...setValue] : [];
      const valueSet = new Set(normalized);
      const typeOfValue =
        dataset.type === "number"
          ? parseFloat(value)
          : dataset.type === "boolean"
          ? value === "true"
          : value;
      if (checked) valueSet.add(typeOfValue);
      else valueSet.delete(typeOfValue);
      setValue = Array.from(valueSet);
    } else {
      setValue = checked;
    }
    this.setState(
      {
        value: setValue,
        error: this.isInvalid(setValue),
      } as any,
      () => this.returnData()
    );
  }

  override get inputProps(): Record<string, any> {
    const props = { ...super.inputProps };
    const currentValue = this.state.value as CheckboxValue;
    props.required = this.props.required
      ? Array.isArray(currentValue)
        ? currentValue.length === 0
        : currentValue !== true
      : false;
    return props;
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { options, label, disabled, readOnly, hidden, labelInline } = this.props;
    const hasOptions = Array.isArray(options);
    const nodes = hasOptions
      ? options!.map(this.nodeOption).filter(Boolean)
      : this.nodeOption({
          disabled,
          hidden,
          label,
          readOnly,
          value: true,
        } as RadioFieldOption);

    return React.createElement(
      React.Fragment,
      {},
      label && hasOptions && this.labelNode,
      label && hasOptions && !labelInline && React.createElement("br"),
      nodes,
      React.createElement(
        React.Fragment,
        {},
        this.errorMessageNode,
        this.messageNode
      ),
      children
    );
  }
}
