import React, { createRef } from "react";
import eventHandler from "../../functions/event-handler";
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
    this.setState({ value }, () => this.onFilter());
  }

  onFilter(value = this.state.value) {
    const { options } = this.props;
    if (options?.length) {
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

  onUpdate({ options, more, value, ...data }) {
    if (typeof options !== 'undefined') {
      const newState = {
        loading: false
      };
      const { maxItems } = this.props;
      newState.options = options.slice(0, maxItems);
      newState.more = (options.length > maxItems) || more;
      this.setState(newState);
    }
    if (typeof value !== 'undefined') {
      const newState = {
        value: '',
        selected: null
      };
      if (![null, ''].includes(value)) {
        const opt = (newState.options || this.state.options)
          .concat(this.props.options || [])
          .find(opt => opt.value == value);
        if (opt) {
          newState.value = opt.label;
          newState.selected = opt;
        }
      }
      this.setState(newState);
      return;
    }
    super.onUpdate(data);
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
    });
  }

  onSelectOption(opt) {
    this.setState({
      value: opt.value !== null ? opt.label : '',
      selected: opt,
      error: false
    }, () => {
      this.hide();
      this.returnData(opt.value, { option: opt });
    });
  }

  mapOptions = (opt, i) => {
    return <li key={opt.value} className={opt.disabled ? 'muted' : ''}>
      <span className="dropdown-item" style={{ cursor: 'pointer' }}
        onClick={(!opt.disabled ? () => this.onSelectOption(opt) : undefined)}
      >
        {opt.label}
      </span>
      {opt.divider && <hr className="m-0" />}
    </li >
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
    const cn = ['dropdown-menu', showDropdown];
    const closeStyle = {
      top: 0,
      left: 0,
      position: 'fixed',
      width: '100%',
      height: '100vh',
      opacity: 0,
      zIndex: 1000
    };
    return <>
      {showDropdown && <div onClick={this.hide} style={closeStyle}></div>}
      {super.inputNode}
      {l && loading}
      <ul className={cn.join(' ')} ref={this.menuDropdown} style={{ minWidth: '100%', overflow: 'hidden', zIndex: 1001 }}>
        {options.map(this.mapOptions)}
        {more && <li >
          <span className="dropdown-item text-wrap" >...</span>
        </li>}
      </ul>
    </>
  }
}