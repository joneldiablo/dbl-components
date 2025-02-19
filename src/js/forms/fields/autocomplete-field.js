import React, { createRef } from "react";

import { eventHandler } from "dbl-utils";

import Field from "./field";

export default class AutocompleteField extends Field {

  static jsClass = 'AutocompleteField';
  static defaultProps = {
    ...Field.defaultProps,
    maxItems: 6
  }

  constructor(props) {
    super(props);
    this.menuDropdown = createRef();
    this.state.options = (props.options || []).slice(0, props.maxItems);
    this.state.more = !!(props.options || []).slice(props.maxItems).length;
    this.state.showDropdown = '';
    if (props.value || props.default) {
      const opt = this.state.options.find(opt => opt.value == props.value || opt.value == props.default);
      this.state.value = opt ? opt.label : '';
    }
  }

  onChange(e) {
    let { value } = e.target;
    if (value) this.state.showDropdown = 'show';
    this.setState({ value }, () => this.onFilter());
  }

  onFilter(value = this.state.value) {
    const { options, forceUseFilter } = this.props;
    if (options?.length && !forceUseFilter) {
      const { maxItems } = this.props;
      const allOpts = options.filter(opt =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      );
      this.setState({
        options: allOpts.slice(0, maxItems),
        more: !!allOpts.slice(maxItems).length
      });
    } else {
      clearTimeout(this.timeoutFilter);
      this.timeoutFilter = setTimeout(() => {
        this.setState({ loading: true });
        eventHandler.dispatch('filter.' + this.props.name, value);
      }, 300);
    }
  }

  onUpdate({ options, more, value, reset, ...update }) {
    if (typeof options !== 'undefined') {
      this.state.loading = false;
      const { maxItems } = this.props;
      this.state.options = options.slice(0, maxItems);
      this.state.more = (options.length > maxItems) || more;
    }

    if (typeof value !== 'undefined') {

      this.state.value = '';
      this.state.selected = null;

      if (![null, ''].includes(value)) {
        const opt = (options || this.state.options)
          .concat(this.props.options || [])
          .find(opt => opt.value == value);
        this.onSelectOption(opt);
      }

      if (this.input.current) {
        const error = this.isInvalid(value);
        if (this.state.error !== error) this.state.error = error;
      }
    }

    if (reset) {
      this.state.value = '';
      this.state.selected = null;

      if (![null, '', undefined].includes(this.props.default)) {
        const opt = (options || this.state.options)
          .concat(this.props.options || [])
          .find(opt => opt.value == this.props.default);
        if (opt) {
          this.state.value = opt.label;
          this.state.selected = opt;
        }
      }
      this._reset = true;
      this.returnData();
    }
    return super.onUpdate(update);
  }

  show = () => {
    this.setState({
      showDropdown: 'show',
      value: '',
    }, () => this.onFilter());
  }

  hide = () => {
    const opt = this.state.selected;
    const value = opt ? opt.label : '';
    this.setState({
      showDropdown: '',
      value
    }, () => {
      if (opt) {
        const error = this.isInvalid(opt.value);
        if (this.state.error != error) this.setState({ error });
      }
    });
  }

  onSelectOption(opt) {
    this.setState({
      value: opt && opt.value !== null ? opt.label : '',
      selected: opt,
      error: false
    }, () => {
      if (!opt) return;
      this.hide();
      this.returnData(opt.value, { option: opt });
    });
  }

  mapOptions = (optRaw, i) => {
    if (!optRaw) return false;

    const modify = typeof this.props.mutations === 'function'
      && this.props.mutations(`${this.props.name}.${optRaw.value}`, optRaw);
    const opt = Object.assign({}, optRaw, modify || {});
    if (opt.active === false) return false;

    return React.createElement('li',
      { key: opt.value, className: opt.disabled ? 'muted' : '' },
      React.createElement('span',
        {
          className: "dropdown-item", style: { cursor: 'pointer' },
          onClick: (!opt.disabled ? () => this.onSelectOption(opt) : undefined)
        },
        opt.label
      ),
      opt.divider && React.createElement('hr', className = "m-0")
    )
  }

  get type() {
    return 'text';
  }

  get inputProps() {
    const props = super.inputProps;
    props.onFocus = !(props.disabled || props.readOnly) ? (() => [this.show(), super.inputProps.onFocus()]) : null;
    props.autoComplete = "off";
    props.list = "autocompleteOff";
    return props;
  }

  get inputNode() {
    const { loading } = this.props;
    const { options, more, showDropdown, loading: l } = this.state;
    const cn = ['dropdown-menu shadow', showDropdown];
    const closeStyle = {
      top: 0,
      left: 0,
      position: 'fixed',
      width: '100%',
      height: '100vh',
      opacity: 0,
      zIndex: 1000
    };
    const inputRect = this.input.current?.getBoundingClientRect() || {};
    return React.createElement(React.Fragment, {},
      showDropdown && React.createElement('div', { onClick: this.hide, style: closeStyle }),
      super.inputNode,
      l && loading,
      React.createElement('ul',
        {
          className: cn.flat().join(' '), ref: this.menuDropdown,
          style: {
            minWidth: inputRect.width || 200,
            left: inputRect.left,
            top: (inputRect.top || 0) + (inputRect.height || 0),
            overflow: 'hidden',
            zIndex: 1001,
            position: 'fixed',
          }
        },
        options.map(this.mapOptions).filter(o => !!o),
        more && React.createElement('li', {},
          React.createElement('span', { className: "dropdown-item text-wrap" }, '...')
        )
      )
    );
  }
}