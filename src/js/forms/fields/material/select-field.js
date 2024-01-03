import PropTypes from 'prop-types';
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Field from "./field";

export default class SelectField extends Field {

  static propTypes = {
    ValueTemplate: PropTypes.any,
    disabled: PropTypes.any,
    fullWidth: PropTypes.any,
    info: PropTypes.any,
    label: PropTypes.any,
    name: PropTypes.any,
    options: PropTypes.any,
    placeholder: PropTypes.any,
    required: PropTypes.any,
    variant: PropTypes.any
  }

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
      renderValue: selected => selected
        ? React.createElement(ValueTemplate, { value: selected },
          options.find(e => e.value === selected)?.label
        )
        : React.createElement('span', { style: { opacity: .5 } }, placeholder)
    }

    return React.createElement(FormControl,
      { ...fcProps },
      React.createElement(InputLabel,
        { htmlFor: name, id: name + '-label', required },
        label
      ),
      React.createElement(Select,
        { ...inputProps },
        options.map(opt =>
          React.createElement(MenuItem,
            { key: opt.value, value: opt.value, disabled: opt.disabled },
            React.createElement(ValueTemplate, { value: opt.value }, opt.label)
          )
        )
      ),
      error && React.createElement(FormHelperText, {}, errorMessage)
    )
  }
}