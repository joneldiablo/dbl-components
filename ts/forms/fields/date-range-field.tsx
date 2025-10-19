import React, { createRef } from "react";
import moment from "moment";

import Field, { type FieldProps } from "./field";

export interface DateRangeFieldProps extends FieldProps {
  errorMessage?: string;
}

export default class DateRangeField extends Field<DateRangeFieldProps> {
  declare props: DateRangeFieldProps;

  static override jsClass = "DateRangeField";
  static override defaultProps: Partial<DateRangeFieldProps> = {
    ...Field.defaultProps,
    default: ["", ""],
  };

  private inputEnd = createRef<HTMLInputElement>();

  override isInvalid(value: any): boolean {
    const error = super.isInvalid(value);
    this.inputEnd.current?.setCustomValidity("");
    const isAfter = Array.isArray(value)
      ? moment(value[0]).isAfter(value[1])
      : false;
    if (isAfter) {
      const message =
        typeof this.props.errorMessage === "string"
          ? this.props.errorMessage
          : this.extractString(this.props.errorMessage as React.ReactNode);
      this.inputEnd.current?.setCustomValidity(message);
    }
    return error || isAfter;
  }

  override get type(): string {
    return "date";
  }

  override onChange({ target }: { target: HTMLInputElement }): void {
    const { name } = this.props;
    const current = Array.isArray(this.state.value)
      ? [...this.state.value]
      : ["", ""];
    const index = target.name === name ? 0 : 1;
    current[index] = target.value;
    const error = this.isInvalid(current);
    this.setState(
      {
        value: current,
        error,
      } as any,
      () => {
        if (current.every((val) => !!val)) this.returnData();
      }
    );
  }

  override get inputNode(): React.ReactNode {
    const { inline, controlClasses } = this.props;
    const baseProps = this.inputProps;
    const value = Array.isArray(baseProps.value)
      ? baseProps.value
      : [baseProps.value, baseProps.value];
    const styleBase = (baseProps.style as React.CSSProperties) || {};
    const middleClasses = [
      "input-group-text bg-transparent p-0",
      controlClasses,
      this.state.error ? "border-danger" : null,
    ]
      .flat()
      .filter(Boolean)
      .join(" ");

    const fromInputProps = {
      ...baseProps,
      value: value[0],
      style: { ...styleBase, borderRight: "none" },
    };
    const toInputProps = {
      ...baseProps,
      name: `${baseProps.name}-end`,
      id: `${baseProps.name}-end`,
      ref: this.inputEnd,
      value: value[1],
      style: { ...styleBase, borderLeft: "none" },
    };

    const inputGroup = React.createElement(
      "div",
      { className: "input-group" },
      React.createElement("input", { ...fromInputProps }),
      React.createElement("span", { className: middleClasses }, "-"),
      React.createElement("input", { ...toInputProps })
    );

    return inline
      ? React.createElement("div", { className: "col-auto" }, inputGroup)
      : inputGroup;
  }
}
