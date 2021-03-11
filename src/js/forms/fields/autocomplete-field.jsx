import React, { createRef } from "react";
import Field from "./field";

export default class AutocompleteField extends Field {

  static defaultProps = {
    ...Field.defaultProps,
    maxLength: 6
  }

  listName = this.props.name + '-list';
  closeStyle = {
    top: 0,
    left: 0,
    position: 'fixed',
    width: '100%',
    height: '100vh',
    opacity: 0
  };

  constructor(props) {
    super(props);
    this.menuDropdown = createRef();
    this.state.options = props.options || [];
    this.state.options = (props.options || []).slice(0, props.maxLength);
    this.state.more = (props.options || []).slice(props.maxLength);
    this.state.showDropdown = '';
  }

  onChange(e) {
    let { value } = e.target;
    this.setState({
      value,
      error: this.isInvalid(value)
    }, this.onFilter);

  }

  onFilter(value = this.state.value) {
    const { onFilter, maxLength } = this.props;
    const { error } = this.state;
    if (!error) {
      if (typeof onFilter === 'function') {
        clearTimeout(this.timeoutFilter);
        this.setState({ loading: true });
        this.timeoutFilter = setTimeout(async () => {
          const allOpts = await onFilter(value);
          this.setState({
            options: allOpts.slice(0, maxLength),
            more: allOpts.slice(maxLength),
            loading: false
          });
        }, 300);
      } else {
        const { options } = this.props;
        const allOpts = options.filter(opt =>
          opt.label.toLowerCase()
            .includes(value.toLowerCase()));
        this.setState({
          options: allOpts.slice(0, maxLength),
          more: allOpts.slice(maxLength)
        });
      }
    }

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
    this.returnData(opt.value);
    this.setState({
      value: opt.value !== null ? opt.label : '',
      error: this.isInvalid(opt.label)
    });
  }

  mapOptions = (opt, i) => {
    return <li key={opt.value}>
      <span className="dropdown-item"
        onClick={() => this.onSelectOption(opt)}
      >
        {opt.label}
      </span>
      {opt.divider && <hr className="m-0"/>}
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
    const { options, more, showDropdown, loading: l } = this.state;
    const { loading } = this.props;
    const cn = ['dropdown-menu', showDropdown];
    return <>
      {showDropdown && <div onClick={this.hide} style={this.closeStyle}></div>}
      {super.inputNode}
      {l && loading}
      <ul className={cn.join(' ')} ref={this.menuDropdown} style={{ width: '100%', overflow: 'hidden' }}>
        {options.map(this.mapOptions)}
        {!!(more?.length) && <li >
          <span className="dropdown-item text-wrap" >...</span>
        </li>}
      </ul>
    </>
  }
}