import React from "react";

import RadioField, {
  type RadioFieldOption,
  type RadioFieldProps,
} from "./radio-field";

type CheckboxValue = boolean | Array<string | number | boolean>;

export interface CheckboxFieldProps extends RadioFieldProps {
  options?: RadioFieldOption;
}

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
    props.required =
      this.props.required && Array.isArray(this.state.value) && !this.state.value.length;
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
