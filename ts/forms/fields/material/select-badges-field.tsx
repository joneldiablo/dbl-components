import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Chip from "@material-ui/core/Chip";

import Field, { type MaterialFieldProps } from "./field";

export interface MaterialOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SelectBadgesFieldProps extends MaterialFieldProps {
  options?: MaterialOption[];
  placeholder?: string;
}

/**
 * Multiple select field rendering selected items as removable Material UI chips.
 */
export default class SelectBadgesField extends Field {
  declare props: SelectBadgesFieldProps;

  static override defaultProps: Partial<SelectBadgesFieldProps> = {
    ...Field.defaultProps,
    value: [],
    options: [],
  };

  constructor(props: SelectBadgesFieldProps) {
    super(props);
    this.state = {
      ...this.state,
      value: Array.isArray(props.value) ? (props.value as string[]) : [],
    };
  }

  private remove = (item: string) => (): void => {
    this.setState((prev) => ({
      ...prev,
      value: Array.isArray(prev.value)
        ? prev.value.filter((val) => val !== item)
        : [],
    }));
  };

  private badge = (item: string, index: number): React.ReactNode => {
    const option = this.props.options?.find((opt) => opt.value === item);
    return (
      <Chip
        key={index}
        style={{ margin: 5 }}
        color="secondary"
        label={option?.label ?? item}
        onDelete={this.remove(item)}
      />
    );
  };

  override render(): React.ReactNode {
    const {
      variant,
      fullWidth,
      info,
      name = "",
      label,
      disabled,
      placeholder,
      required,
      options = [],
    } = this.props;
    const { value, error, errorMessage } = this.state;
    const valueArray = Array.isArray(value) ? value : [];

    const labelText = typeof label === "string" ? label : "";
    return (
      <FormControl variant={variant} fullWidth={fullWidth} error={error}>
        <InputLabel htmlFor={name} id={`${name}-label`} required={required}>
          {label}
        </InputLabel>
        <Select
          startAdornment={info ? this.nodeInfo(info) : undefined}
          label={label as string}
          labelId={`${name}-label`}
          id={name}
          name={name}
          value={valueArray}
          displayEmpty
          multiple
          disabled={disabled}
          onChange={this.onChange}
          renderValue={(selected) => {
            const selectedValues = selected as string[];
            if (!selectedValues.length) {
              return <span style={{ opacity: 0.5 }}>{placeholder}</span>;
            }
            return <span>{`${selectedValues.length} ${labelText}`.trim()}</span>;
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{errorMessage}</FormHelperText>}
        <div style={{ padding: "12px 0px" }}>{valueArray.map(this.badge)}</div>
      </FormControl>
    );
  }
}
