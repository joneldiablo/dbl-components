import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Field from "./field";

export default class SelectField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    options: [],
    ValueTemplate: ({ children }) => children
  }

  render() {
    let { variant, fullWidth, info, name,
      label, disabled, placeholder,
      ValueTemplate, options, required
    } = this.props;
    let { value, error, errorMessage } = this.state;

    let fcProps = {
      variant,
      fullWidth,
      error
    }
    let inputProps = {
      startAdornment: info && this.nodeInfo(info),
      label,
      labelId: name + '-label',
      id: name,
      name,
      value,
      displayEmpty: true,
      disabled,
      onChange: this.onChange,
      renderValue: selected => selected ?
        <ValueTemplate value={selected}>
          {options.find(e => e.value === selected)?.label}
        </ValueTemplate> :
        <span style={{ opacity: .5 }}>{placeholder}</span>
    }

    return <FormControl {...fcProps} >
      <InputLabel htmlFor={name} id={name + '-label'} required={required}>
        {label}
      </InputLabel>
      <Select {...inputProps}>
        {options.map(opt =>
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            <ValueTemplate value={opt.value}>{opt.label}</ValueTemplate>
          </MenuItem>
        )}
      </Select>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  }
}