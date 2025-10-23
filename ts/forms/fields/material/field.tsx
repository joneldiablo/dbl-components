import React from "react";
import TextField, { type TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import Info from "./info";

export interface MaterialFieldProps {
  disabled?: boolean;
  fullWidth?: boolean;
  info?: React.ReactNode;
  label?: React.ReactNode;
  name?: string;
  placeholder?: string;
  required?: boolean;
  variant?: TextFieldProps["variant"];
  value?: string;
  type?: string;
  validation?: (value: string) => boolean;
  pattern?: RegExp;
  errorMessage?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}

interface MaterialFieldState {
  value: string | string[];
  errorMessage: React.ReactNode | null;
  error: boolean;
}

/**
 * Thin wrapper around Material UI's {@link TextField} that adds inline helper info,
 * basic validation hooks and replicates the original JS component's behaviour.
 */
export default class Field extends React.Component<MaterialFieldProps, MaterialFieldState> {
  static defaultProps: Partial<MaterialFieldProps> = {
    type: "text",
    style: { fontSize: 12 },
    variant: "outlined",
    fullWidth: true,
  };

  state: MaterialFieldState = {
    value: Array.isArray(this.props.value)
      ? this.props.value
      : this.props.value ?? "",
    errorMessage: null,
    error: false,
  };

  constructor(props: MaterialFieldProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { validation, pattern, onChange, required, errorMessage } = this.props;
    const rawValue = e.target.value;
    const value = Array.isArray(rawValue) ? rawValue : rawValue ?? "";

    let error =
      Boolean(required) &&
      (Array.isArray(value) ? value.length === 0 : value === "");
    const valueForValidation = Array.isArray(value) ? value.join(",") : value;
    if (typeof validation === "function") error = !!validation(valueForValidation);
    else if (pattern instanceof RegExp) error = !pattern.test(valueForValidation);

    this.setState({
      value,
      error,
      errorMessage: error ? errorMessage ?? null : null,
    });

    if (typeof onChange === "function") onChange(e);
  }

  get type(): string | undefined {
    return this.props.type;
  }

  protected nodeInfo(info?: React.ReactNode): React.ReactNode {
    if (!info) return null;
    return (
      <InputAdornment position="start">
        <Info message={info} />
      </InputAdornment>
    );
  }

  render(): React.ReactNode {
    const {
      disabled,
      info,
      required,
      name,
      variant,
      fullWidth,
      placeholder,
      label,
      style,
    } = this.props;
    const { value, error, errorMessage } = this.state;

    const inputProps: TextFieldProps = {
      label,
      name,
      id: name,
      type: this.type,
      placeholder,
      required,
      disabled,
      value: Array.isArray(value) ? "" : value,
      onChange: this.onChange,
      error,
      helperText: errorMessage,
      InputProps: { startAdornment: this.nodeInfo(info) } as TextFieldProps["InputProps"],
      autoComplete: "off",
      variant,
      fullWidth,
      style,
    };

    return (
      <>
        <TextField {...inputProps} />
        <br />
        <br />
      </>
    );
  }
}
