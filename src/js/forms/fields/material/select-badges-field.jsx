import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Chip from "@material-ui/core/Chip";
import Field from "./Field";

export default class SelectBadgesField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    value: [],
    options: []
  }

  state = {
    value: (Array.isArray(this.props.value) ? this.props.value : []),
    errorMessage: null,
    error: false
  }

  remove(item) {
    return () => {
      let value = this.state.value.filter(val => val !== item);
      this.setState({ value });
    }
  }

  badge = (item, i) => {
    let props = {
      key: i,
      style: { margin: 5 },
      color: 'secondary',
      label: this.props.options.find(e => e.value === item).label,
      onDelete: this.remove(item)
    }
    return (<Chip {...props} />);
  }

  render() {
    let { variant, fullWidth, info, name,
      label, disabled, placeholder, required } = this.props;
    let { value, error, errorMessage } = this.state;

    let fcProps = {
      variant,
      fullWidth,
      error
    }
    let inputProps = {
      startAdornment: this.nodeInfo(info),
      label,
      labelId: name + '-label',
      id: name,
      name,
      value,
      displayEmpty: true,
      multiple: true,
      disabled,
      onChange: this.onChange,
      renderValue: selected => <>{
        selected.length === 0 ?
          <span style={{ opacity: .5 }}>{placeholder}</span> :
          <span> {selected.length} {label}</span>
      }</>
    }

    return <FormControl {...fcProps} >
      <InputLabel htmlFor={name} id={name + '-label'} required={required}>{label}</InputLabel>
      <Select {...inputProps}>
        {this.props.options.map(opt =>
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</MenuItem>
        )}
      </Select>
      {error && <FormHelperText>{errorMessage}</FormHelperText>}
      <div style={{ padding: '12px 0px' }}>
        {value.map(this.badge)}
      </div>
    </FormControl>
  }
}