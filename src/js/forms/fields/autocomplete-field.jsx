import React, { createRef } from "react";
import eventHandler from "../../functions/event-handler";
import Field from "./field";

export default class AutocompleteField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    maxLength: 6
  }

  constructor(props) {
    super(props);
    this.menuDropdown = createRef();
    this.state.options = (props.options || []).slice(0, props.maxLength);
    this.state.more = !!(props.options || []).slice(props.maxLength).length;
    this.state.showDropdown = '';
  }

  onChange(e) {
    let { value } = e.target;
    this.setState({ value }, () => this.onFilter());
  }

  onFilter(value = this.state.value) {
    const { options } = this.props;
    if (options?.length) {
      const { maxLength } = this.props;
      const allOpts = options.filter(opt =>
        opt.label.toLowerCase().includes(value.toLowerCase())
      );
      this.setState({
        options: allOpts.slice(0, maxLength),
        more: !!allOpts.slice(maxLength).length
      });
    } else {
      clearTimeout(this.timeoutFilter);
      this.timeoutFilter = setTimeout(() => {
        this.setState({ loading: true });
        eventHandler.dispatch('filter.' + this.props.name, value);
      }, 300);
    }
  }

  onUpdate({ options, more, ...data }) {
    const { maxLength } = this.props;
    this.setState({
      options: options.slice(0, maxLength),
      more: (options.length > maxLength) || more,
      loading: false
    });
    super.onUpdate(data);
  }

  show = () => {
    this.setState({
      showDropdown: 'show'
    });
  }

  hide = () => {
    this.setState({
      showDropdown: ''
    });
  }

  onSelectOption(opt) {
    this.hide();
    this.setState({
      value: opt.value !== null ? opt.label : '',
      error: this.isInvalid(opt.value)
    }, () => this.returnData(opt.value));
  }

  mapOptions = (opt, i) => {
    return <li key={opt.value}>
      <span className="dropdown-item"
        onClick={() => this.onSelectOption(opt)}
      >
        {opt.label}
      </span>
      {opt.divider && <hr className="m-0" />}
    </li>
  }

  get type() {
    return 'text';
  }

  get inputProps() {
    const props = super.inputProps;
    props.onFocus = this.show;
    props.autoComplete = "off";
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
      opacity: 0
    };
    return <>
      {showDropdown && <div onClick={this.hide} style={closeStyle}></div>}
      {super.inputNode}
      {l && loading}
      <ul className={cn.join(' ')} ref={this.menuDropdown} style={{ width: '100%', overflow: 'hidden' }}>
        {options.map(this.mapOptions)}
        {more && <li >
          <span className="dropdown-item text-wrap" >...</span>
        </li>}
      </ul>
    </>
  }
}