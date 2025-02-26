import PropTypes from 'prop-types';
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Chip from "@material-ui/core/Chip";

import Field from "./field";

export default class SelectBadgesField extends Field {

  static propTypes = {
    options: PropTypes.any,
    disabled: PropTypes.any,
    fullWidth: PropTypes.any,
    info: PropTypes.any,
    label: PropTypes.any,
    name: PropTypes.any,
    placeholder: PropTypes.any,
    required: PropTypes.any,
    variant: PropTypes.any
  }

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
    return React.createElement(Chip, { ...props });
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
      renderValue: selected => React.createElement(React.Fragment, {},
        selected.length === 0
          ? React.createElement('span', { style: { opacity: .5 } }, placeholder)
          : React.createElement('span', {}, selected.length, label)
      )
    }

    return React.createElement(FormControl, { ...fcProps },
      React.createElement(InputLabel,
        { htmlFor: name, id: name + '-label', required },
        label
      ),
      React.createElement(Select, { ...inputProps },
        this.props.options.map(opt =>
          React.createElement(MenuItem,
            { key: opt.value, value: opt.value, disabled: opt.disabled },
            opt.label
          )
        )
      ),
      error && React.createElement(FormHelperText, {}, errorMessage),
      React.createElement('div', { style: { padding: '12px 0px' } },
        value.map(this.badge)
      )
    )
  }
}