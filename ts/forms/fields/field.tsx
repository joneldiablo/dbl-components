import React, { Fragment, createRef, RefObject } from "react";
import { randomS4, eventHandler } from "dbl-utils";

import Component, { ComponentProps, ComponentState } from "../../component";

export interface FieldOption {
  disabled?: boolean;
  divider?: boolean;
  label?: React.ReactNode;
  value: any;
  [key: string]: any;
}

export interface FieldProps extends ComponentProps {
  accept?: string;
  autoComplete?: string | boolean;
  checkValidity?: (value: any) => boolean;
  controlClasses?: string | string[];
  default?: any;
  disabled?: boolean;
  errorMessage?: React.ReactNode | boolean;
  first?: "label" | "control";
  floating?: boolean;
  hidden?: boolean;
  inline?: boolean;
  inlineControlClasses?: string | string[];
  label?: React.ReactNode;
  labelClasses?: string | string[];
  max?: string | number;
  message?: React.ReactNode | boolean;
  messageClasses?: string | string[];
  min?: string | number;
  multiple?: boolean;
  noValidate?: boolean;
  pattern?: string;
  placeholder?: React.ReactNode;
  readOnly?: boolean;
  required?: boolean;
  step?: string | number;
  minLength?: number;
  maxLength?: number;
  list?: string;
  dir?: string;
  type: string;
  value?: any;
  options?: FieldOption[];
  data?: any;
  id?: string;
  _propsControl?: Record<string, unknown>;
}

export interface FieldState extends ComponentState {
  value: any;
  options?: FieldOption[];
  error: boolean;
  pristine: boolean;
  dirty: boolean;
}

export default class Field<P extends FieldProps = FieldProps> extends Component<P> {
  static jsClass = "Field";
  static defaultProps: Partial<FieldProps> = {
    ...Component.defaultProps,
    type: "text",
    default: "",
    value: "",
    first: "label",
    floating: true,
  };

  unique = randomS4();
  input: RefObject<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>;
  ContentWrap: React.ElementType = "div";
  timeoutReturnData?: ReturnType<typeof setTimeout>;
  timeoutRevalidate?: ReturnType<typeof setTimeout>;
  _reset = false;

  state: FieldState = {
    localClasses: "",
    localStyles: {},
    value: this.props.value ?? this.props.default,
    options: this.props.options,
    error: false,
    pristine: true,
    dirty: false,
  };

  constructor(props: P) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onInvalid = this.onInvalid.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.input = createRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>();
  }

  componentDidMount(): void {
    eventHandler.subscribe("update." + this.props.name, this.onUpdate, this.unique);
    eventHandler.dispatch("ready." + this.props.name);
  }

  componentWillUnmount(): void {
    clearTimeout(this.timeoutReturnData);
    clearTimeout(this.timeoutRevalidate);
    eventHandler.unsubscribe("update." + this.props.name, this.unique);
  }

  extractString(obj: React.ReactNode): string {
    if (typeof obj === "string") return obj;
    if (Array.isArray(obj)) return obj.map((e) => this.extractString(e)).flat().join(" ");
    if (React.isValidElement(obj)) return this.extractString((obj as any).props.children);
    if (!obj) return "";
    return obj.toString();
  }

  returnData(value: any = this.state.value, extra?: any): void {
    const { name, id, data } = this.props;
    const { error } = this.state;
    const toDispatch: Record<string, any> = { [name]: value };
    if (id) toDispatch.id = id;
    if (data) toDispatch.data = data;
    if (this._reset) this._reset = false;
    else if (!error) {
      clearTimeout(this.timeoutReturnData);
      this.timeoutReturnData = setTimeout(() => {
        eventHandler.dispatch(name, toDispatch, extra);
      }, 300);
    }
  }

  isInvalid(value: any): boolean {
    const { checkValidity, pattern, required } = this.props;
    let inputValid = true;
    this.input.current?.setCustomValidity("");
    if (typeof this.input.current?.checkValidity === "function") {
      inputValid = this.input.current.checkValidity();
    }
    let valueInvalid = !value;
    if (typeof value === "boolean" || typeof value === "number") valueInvalid = false;
    let error = !inputValid || (!!required && valueInvalid);
    if (!error && typeof checkValidity === "function") error = !checkValidity(value);
    else if (pattern) error = !(new RegExp(pattern, "i")).test(value);
    if (!required && !value) error = false;
    if (error) {
      const errorMessage = this.extractString(this.props.errorMessage as React.ReactNode);
      this.input.current?.setCustomValidity(errorMessage);
    }
    return error;
  }

  onInvalid(): void {
    const { name, required } = this.props;
    const { value } = this.state;
    if (!required && !value) return;
    this.setState(
      { error: true } as any,
      () => eventHandler.dispatch("invalid." + name, { [name]: value })
    );
  }

  onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
    const { value } = e.target;
    const error = this.isInvalid(value);
    this.setState(
      { value, error, pristine: false, dirty: true } as any,
      () => this.returnData()
    );
  }

  onUpdate(updateObj: { value?: any; options?: FieldOption[]; error?: boolean; reset?: boolean; clear?: boolean }): void {
    const { value, options, error, reset, clear } = updateObj;
    const newState: Partial<FieldState> = {};
    if (typeof value !== "undefined") {
      newState.value = value !== null ? value : this.props.default;
      newState.dirty = newState.value === this.props.default;
      newState.pristine = newState.value !== this.props.default;
    }
    if (options) newState.options = options;
    if (typeof error === "boolean") {
      newState.error = error;
      let message = "";
      if (error) message = this.extractString(this.props.errorMessage as React.ReactNode);
      this.input.current?.setCustomValidity(message);
    }
    if (clear) {
      newState.value = newState.value ?? this.props.default;
      return this.setState(newState as any);
    }
    if (reset) {
      newState.value = newState.value ?? this.props.default;
      this._reset = true;
      return this.setState(newState as any, () => this.returnData());
    }
    this.setState(newState as any, () => {
      if (value === undefined) return;
      clearTimeout(this.timeoutRevalidate);
      this.timeoutRevalidate = setTimeout(() => {
        const err = this.isInvalid(value);
        if (this.state.error !== err) this.setState({ error: err } as any);
      }, 300);
    });
  }

  onFocus = (): void => {
    eventHandler.dispatch("focus." + this.props.name);
  };

  get type(): string {
    return this.props.type;
  }

  get inputProps(): Record<string, any> {
    const {
      disabled,
      readOnly,
      accept,
      minLength,
      required,
      name,
      controlClasses,
      maxLength,
      list,
      placeholder: prePlaceholder,
      step,
      noValidate,
      multiple,
      autoComplete,
      min,
      max,
      pattern,
      dir,
      _propsControl = {},
      hidden,
    } = this.props;
    const { value, error } = this.state;
    const cn = ["form-control"] as Array<string | string[]>;
    if (controlClasses) cn.push(controlClasses);
    if (error) cn.push("is-invalid");
    let autocomplete = autoComplete;
    let list1 = list;
    if (autoComplete === false) {
      autocomplete = "off";
      list1 = "autocompleteOff";
    }
    const placeholder = prePlaceholder ? this.extractString(prePlaceholder) : null;
    return {
      id: name,
      name,
      autoComplete: autocomplete,
      list: list1,
      pattern,
      placeholder,
      hidden,
      required,
      type: this.type,
      value,
      className: cn.flat().join(" "),
      min,
      max,
      step,
      noValidate,
      disabled,
      readOnly,
      ref: this.input,
      dir,
      accept,
      multiple,
      maxLength,
      minLength,
      onChange: this.onChange,
      onInvalid: this.onInvalid,
      onFocus: this.onFocus,
      ..._propsControl,
    };
  }

  get labelNode(): React.ReactNode {
    const {
      placeholder,
      required,
      name,
      labelClasses,
      inline,
      label,
      disabled,
    } = this.props;
    const cn = ["form-label", labelClasses];
    if (inline) {
      cn.shift();
      cn.push("py-2");
    }
    const style: React.CSSProperties = {};
    if (disabled) style["opacity"] = 0.9;
    const labelNode = React.createElement(
      "label",
      { className: cn.flat().join(" "), htmlFor: name, style },
      label ? label : placeholder,
      required &&
        React.createElement(
          "b",
          { title: "Este campo es indispensable", className: "text-inherit" },
          " *"
        )
    );
    return labelNode;
  }

  get inputNode(): React.ReactNode {
    return React.createElement("input", { ...this.inputProps });
  }

  get errorMessageNode(): React.ReactNode {
    const { errorMessage } = this.props;
    const { error } = this.state;
    const errorNode = React.createElement(
      "p",
      { className: "m-1 lh-1" },
      React.createElement("small", { className: "text-danger" }, errorMessage as any)
    );
    return error && errorMessage && errorNode;
  }

  get messageNode(): React.ReactNode {
    const { message, messageClasses } = this.props;
    const cnm = ["m-1 lh-1"] as Array<string | string[]>;
    if (messageClasses) cnm.push(messageClasses);
    const node = React.createElement(
      "p",
      { className: cnm.flat().join(" ") },
      React.createElement("small", {}, message as any)
    );
    return message && node;
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { inline, first, placeholder, label, floating, inlineControlClasses } = this.props;
    const cn = ["position-relative"] as Array<string>;
    if (inline) cn.push("d-flex align-items-center");
    if (placeholder && !label && floating) cn.push("form-floating");
    const wrapProps: Record<string, any> = {};
    const className = cn.flat().join(" ");
    if (this.ContentWrap !== Fragment) wrapProps.className = className;
    return React.createElement(
      React.Fragment,
      {},
      React.createElement(
        this.ContentWrap,
        { ...wrapProps },
        floating && first === "label" && label && this.labelNode,
        inline
          ? React.createElement(
              "div",
              { className: inlineControlClasses },
              this.inputNode,
              this.errorMessageNode,
              this.messageNode
            )
          : this.inputNode,
        floating && (first !== "label" || (placeholder && !label)) && this.labelNode,
        !inline &&
          React.createElement(
            React.Fragment,
            {},
            this.errorMessageNode,
            this.messageNode
          ),
        children
      )
    );
  }
}

export type { FieldProps as BaseFieldProps };
