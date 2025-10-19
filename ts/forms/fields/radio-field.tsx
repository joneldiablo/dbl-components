import React from "react";

import JsonRender from "../../json-render";
import Field, { type FieldOption, type FieldProps } from "./field";

/**
 * Option definition accepted by {@link RadioField} and its derivatives.
 *
 * @example
 * ```tsx
 * const option: RadioFieldOption = { label: "Active", value: true };
 * ```
 */
export interface RadioFieldOption extends FieldOption {
  active?: boolean;
  classes?: string | string[];
  hidden?: boolean;
  labels?: [React.ReactNode, React.ReactNode];
  label?: React.ReactNode;
  labelClasses?: string | string[];
  readOnly?: boolean;
}

/**
 * Props accepted by {@link RadioField}.
 *
 * @example
 * ```tsx
 * <RadioField
 *   name="status"
 *   label="Status"
 *   options={[
 *     { label: "Active", value: "active" },
 *     { label: "Inactive", value: "inactive" },
 *   ]}
 * />
 * ```
 */
export interface RadioFieldProps extends FieldProps {
  inline?: boolean;
  labelInline?: boolean;
  labels?: [React.ReactNode, React.ReactNode];
  optionClasses?: string | string[];
  format?: "switch" | "button" | string;
  mutations?: (name: string, option: RadioFieldOption) => Partial<RadioFieldOption> | void;
  options?: RadioFieldOption[];
}

type RadioFieldValue = string | number | boolean | (string | number | boolean)[];

/**
 * Field that renders a list of mutually exclusive options (or multi-select when paired
 * with {@link CheckboxField}) while delegating its layout to JSON schemas.
 *
 * @example
 * ```tsx
 * <RadioField
 *   name="plan"
 *   label="Select a plan"
 *   options={[
 *     { label: "Basic", value: "basic" },
 *     { label: "Pro", value: "pro" },
 *   ]}
 * />
 * ```
 */
export default class RadioField extends Field<RadioFieldProps> {
  declare props: RadioFieldProps;

  static override jsClass = "RadioField";
  static override defaultProps: Partial<RadioFieldProps> = {
    ...Field.defaultProps,
    inline: false,
    labelInline: true,
  };

  private jsonRender: JsonRender;

  constructor(props: RadioFieldProps) {
    super(props);
    const { mutations, ...propsRender } = props;
    this.jsonRender = new JsonRender(propsRender, mutations);
  }

  override get type(): string {
    return "radio";
  }

  override onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void {
    const { value, dataset } = e.target;
    let setValue: RadioFieldValue;
    switch (dataset.type) {
      case "number":
        setValue = parseFloat(value);
        break;
      case "boolean":
        setValue = value === "true";
        break;
      default:
        setValue = value;
        break;
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
    delete props.ref;
    delete props.className;
    let className = "form-check-input";
    if (this.props.format === "button") className = "btn-check";
    return {
      ...props,
      className,
    };
  }

  nodeOption = (itemRaw: RadioFieldOption, i = 0): React.ReactNode => {
    if (!itemRaw) return false;

    const { inline, name, labels: labelsFromProps, optionClasses, format, labelClasses } =
      this.props;
    let { first = "label" } = this.props;
    const value = this.state.value as RadioFieldValue;
    const modify =
      typeof this.props.mutations === "function"
        ? this.props.mutations(`${name}.${itemRaw.value}`, itemRaw)
        : undefined;
    const item: RadioFieldOption = { ...itemRaw, ...(modify || {}) };
    if (item.active === false) return false;

    const id = `${name}-${item.value}`;
    const labels = item.labels || labelsFromProps;
    const checked = Array.isArray(value)
      ? value.includes(item.value as string | number | boolean)
      : item.value === value;
    const disabled =
      typeof item.disabled !== "undefined" ? item.disabled : this.inputProps.disabled;
    const readOnly =
      typeof item.readOnly !== "undefined" ? item.readOnly : this.inputProps.readOnly;

    const optionClassNames: Array<string | string[]> = [];
    if (format === "switch") optionClassNames.push("form-switch");
    else if (format === "button") {
      optionClassNames.push("");
      first = "control";
    } else optionClassNames.push("form-check");
    if (inline) optionClassNames.push("form-check-inline");
    if (item.hidden && !checked) optionClassNames.push("visually-hidden-focusable");
    if (optionClasses) optionClassNames.push(optionClasses);
    if (item.classes) optionClassNames.push(item.classes);

    const inputProps: Record<string, any> = {
      ...this.inputProps,
      disabled,
      readOnly,
      id,
      value: item.value === null ? "" : item.value,
      checked,
      "data-type": typeof item.value,
      style: {
        pointerEvents: readOnly ? "none" : null,
        backgroundColor: readOnly ? "transparent" : null,
      },
    };

    const style: React.CSSProperties = {};
    if (disabled) style.opacity = 0.5;
    const labelClass = [
      format === "button" ? "btn" : "form-check-label",
      labelClasses,
      item.labelClasses,
    ];
    const renderLabel = (payload: React.ReactNode) =>
      React.createElement(
        "label",
        { className: labelClass.flat().join(" "), htmlFor: id, style },
        payload
      );

    const inputNode = Array.isArray(labels)
      ? React.createElement(
          React.Fragment,
          {},
          renderLabel(this.jsonRender.buildContent(labels[0])),
          React.createElement("input", { ...inputProps }),
          renderLabel(this.jsonRender.buildContent(labels[1]))
        )
      : React.createElement("input", { ...inputProps });

    return React.createElement(
      "div",
      {
        key: `${i}-${item.value}`,
        className: optionClassNames.filter(Boolean).flat().join(" "),
        style: { pointerEvents: readOnly ? "none" : null },
      },
      first === "label" && renderLabel(this.jsonRender.buildContent(item.label)),
      inputNode,
      first === "control" && renderLabel(this.jsonRender.buildContent(item.label))
    );
  };

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { options = [], label, labelInline } = this.props;
    const hasOptions = Array.isArray(options);
    return React.createElement(
      React.Fragment,
      {},
      label && hasOptions && this.labelNode,
      label && hasOptions && !labelInline && React.createElement("br"),
      options.map(this.nodeOption).filter(Boolean),
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
