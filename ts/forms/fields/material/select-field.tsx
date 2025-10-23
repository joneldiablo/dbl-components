import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";

import Field, { type MaterialFieldProps } from "./field";

export interface MaterialSelectOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export interface MaterialSelectFieldProps extends MaterialFieldProps {
  ValueTemplate?: React.ComponentType<{ value: string; children?: React.ReactNode }>;
  options?: MaterialSelectOption[];
  placeholder?: string;
}

/**
 * Material UI single select wrapper supporting custom option renderers.
 */
export default class SelectField extends Field {
  declare props: MaterialSelectFieldProps;

  static override defaultProps: Partial<MaterialSelectFieldProps> = {
    ...Field.defaultProps,
    options: [],
    ValueTemplate: ({ children }) => <>{children}</>,
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
      ValueTemplate = ({ children }) => <>{children}</>,
      options = [],
      required,
    } = this.props;
    const { value, error, errorMessage } = this.state;

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
          value={value ?? ""}
          displayEmpty
          disabled={disabled}
          onChange={this.onChange}
          renderValue={(selected) =>
            selected
              ? (
                  <ValueTemplate value={selected as string}>
                    {options.find((o) => o.value === selected)?.label}
                  </ValueTemplate>
                )
              : (
                  <span style={{ opacity: 0.5 }}>{placeholder}</span>
                )
          }
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              <ValueTemplate value={opt.value}>{opt.label}</ValueTemplate>
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    );
  }
}
