import React from "react";
import { eventHandler } from "dbl-utils";

import JsonRender from "../../json-render";
import Field, { type FieldProps } from "./field";
import NoWrapField from "./no-wrap-field";

export interface NewPasswordPattern {
  pattern: string | RegExp;
  errorMessage: React.ReactNode;
}

export interface NewPasswordFieldProps extends FieldProps {
  labelRepeat?: React.ReactNode;
  placeholderRepeat?: string;
  dividerClasses?: string;
  patterns?: NewPasswordPattern[];
  mutations?: (name: string, section: any) => any;
  errorMessageRepeat?: React.ReactNode;
  inlineFields?: boolean;
}

interface NewPasswordFieldState {
  valueRepeat?: string | null;
}

/**
 * Field that renders a password input alongside a repeat confirmation field and displays
 * dynamic validation hints for configurable patterns.
 */
export default class NewPasswordField extends Field<NewPasswordFieldProps> {
  declare props: NewPasswordFieldProps;
  declare state: Field["state"] & NewPasswordFieldState;

  static override jsClass = "NewPasswordField";
  static override defaultProps: Partial<NewPasswordFieldProps> = {
    ...Field.defaultProps,
    dividerClasses: "mb-3",
  };

  private jsonRender: JsonRender;

  constructor(props: NewPasswordFieldProps) {
    super(props);
    const { mutations, ...jsonProps } = props as NewPasswordFieldProps & Record<string, any>;
    this.jsonRender = new JsonRender(jsonProps, mutations);
    this.state = {
      ...this.state,
      valueRepeat: null,
    };
  }

  override get type(): string {
    return "password";
  }

  override componentDidMount(): void {
    super.componentDidMount();
    eventHandler.subscribe(`${this.props.name}-repeat`, this.onUpdateRepeat, this.unique);
  }

  override componentWillUnmount(): void {
    super.componentWillUnmount();
    eventHandler.unsubscribe(`${this.props.name}-repeat`, this.unique);
  }

  override returnData(
    value: any = this.state.value,
    valueRepeat: any = this.state.valueRepeat
  ): void {
    if (value === valueRepeat) super.returnData(value);
  }

  onUpdateRepeat = (data: Record<string, any>): void => {
    const key = `${this.props.name}-repeat`;
    this.setState(
      { valueRepeat: data[key] } as Partial<NewPasswordFieldState> as any,
      () => {
        if (!this.isInvalid()) this.returnData();
      }
    );
  };

  override isInvalid(
    value: any = this.state.value,
    valueRepeat: any = this.state.valueRepeat
  ): boolean {
    const error = super.isInvalid(value);
    const diff = value !== valueRepeat;
    eventHandler.dispatch(`update.${this.props.name}-repeat`, { error: diff });
    return error;
  }

  override get errorMessageNode(): React.ReactNode {
    const { errorMessage: baseError, patterns } = this.props;
    const { error, value } = this.state;
    if (!error) return false;
    if (!baseError && !patterns?.length) return false;

    const messages: React.ReactNode[] = [];
    if (baseError) messages.push(baseError);

    if (Array.isArray(patterns) && patterns.length) {
      const valueString = typeof value === "string" ? value : "";
      const listItems = patterns
        .map(({ pattern, errorMessage }, index) => {
          const regex =
            pattern instanceof RegExp ? pattern : new RegExp(pattern as string);
          if (regex.test(valueString)) return null;
          const content = this.jsonRender.buildContent(errorMessage);
          return React.createElement("li", { key: index }, content);
        })
        .filter(Boolean) as React.ReactNode[];

      if (listItems.length) {
        messages.push(React.createElement("ul", { key: "patterns" }, ...listItems));
      }
    }

    return React.createElement(
      "div",
      { className: "m-1 lh-1" },
      React.createElement("small", { className: "text-danger" }, ...messages)
    );
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      labelRepeat,
      placeholderRepeat,
      name,
      errorMessageRepeat,
      dividerClasses = "mb-3",
      inlineFields,
      ...rest
    } = this.props;

    const { children: _repeatChildren, ...restWithoutChildren } = rest as FieldProps & {
      children?: React.ReactNode;
    };

    const repeatFieldProps: FieldProps = {
      ...restWithoutChildren,
      name: `${name}-repeat`,
      type: this.type,
      label: labelRepeat,
      placeholder: placeholderRepeat,
      errorMessage: errorMessageRepeat,
      required: true,
    };

    if (inlineFields) {
      return React.createElement(
        "div",
        { className: "row" },
        React.createElement("div", { className: "col" }, super.content(false)),
        React.createElement(
          "div",
          { className: "col" },
          React.createElement(NoWrapField, repeatFieldProps)
        ),
        React.createElement("div", { className: "col-12" }, children)
      );
    }

    return React.createElement(
      React.Fragment,
      {},
      super.content(false),
      React.createElement("div", { className: dividerClasses }),
      React.createElement(NoWrapField, repeatFieldProps),
      children
    );
  }
}
