import React from "react";

import Field, { FieldProps, FieldOption } from "./field";

export interface SelectFieldProps extends FieldProps {
  options?: FieldOption[];
  mutations?: (name: string, conf: any) => any;
}

export default class SelectField<P extends SelectFieldProps = SelectFieldProps> extends Field<P> {
  static jsClass = "SelectField";
  static defaultProps: Partial<SelectFieldProps> = {
    ...Field.defaultProps,
  };

  onChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const { value } = e.target;
    const opt = this.props.options?.find((opt) => opt.value == value);
    this.setState(
      { value, error: this.isInvalid(value) } as any,
      () => this.returnData(opt ? opt.value : value, { option: opt })
    );
  }

  get inputProps(): Record<string, any> {
    const props = { ...super.inputProps };
    delete props.placeholder;
    delete props.type;
    props.className = props.className.replace("form-control", "form-select");
    return props;
  }

  get inputNode(): React.ReactNode {
    const { placeholder, options, label, floating, mutations, name } = this.props;
    return React.createElement(
      "select",
      { ...this.inputProps },
      placeholder && (label || !floating) &&
        React.createElement("option", { value: "" }, this.extractString(placeholder)),
      placeholder && (label || !floating) &&
        React.createElement("option", { disabled: true }, "──────────"),
      ...[
        Array.isArray(options) &&
          options
            .map((opt) => {
              if (!opt) return false;
              const modify =
                typeof mutations === "function" &&
                mutations(`${name}.${opt.value}`, opt);
              const { active, disabled, label: lbl, value, title } = Object.assign(
                {},
                opt,
                modify || {}
              );
              if (active === false) return false;
              const propsOpt = { value, disabled, title };
              return React.createElement(
                "option",
                { key: value, ...propsOpt },
                lbl as any
              );
            })
      ]
        .flat()
        .filter(Boolean)
    );
  }
}
