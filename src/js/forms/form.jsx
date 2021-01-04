import React from "react";
import PropTypes from 'prop-types';
import flatten from "flat";
import schemaManager from "../functions/schema-manager"
import Fields from "./fields/fields";

const templateComponents = {

}

export const setTemplateComponents = (_components) => {
  Object.assign(templateComponents, _components);
}

export default class Form extends React.Component {

  static propTypes = {
    action: PropTypes.string,
    method: PropTypes.string,
    clearAfterDone: PropTypes.bool,
    headers: PropTypes.object,
    onBeforeSubmit: PropTypes.func,
    onDone: PropTypes.func,
    onError: PropTypes.func,
    onAfterSubmit: PropTypes.func,
    fields: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
    template: PropTypes.object
  }

  static defaultProps = {
    action: null,
    method: 'get',
    clearAfterDone: false,
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    onBeforeSubmit: (d => d),
    onDone: null,
    onError: null,
    onAfterSubmit: null,
    fields: null,
    className: '',
    style: {},
    template: null
  }

  Template = templateComponents[this.props.template];

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    let fields = schemaManager.resolveRefs(this.props.fields);
    this.state = {
      fields,
      data: {},
      loading: false
    };
  }

  clear() {
    let { clearAfterDone } = this.props;
    if (clearAfterDone)
      this.defaults();
  }

  defaults() {
    this.setState({ data: {} });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    let { action, method, headers, onAfterSubmit, onDone, onError, onSubmit } = this.props;
    let { loading, data } = this.state;
    if (!action && typeof onSubmit === 'function') {
      return onSubmit(data);
    }
    if (loading) return;
    this.setState({ loading: true });
    method = method.toUpperCase();
    let opts = {
      method,
      headers
    }
    if (method === 'get') {
      let flatData = flatten(data);
      let query = new URLSearchParams(flatData).toString();
      action += '?' + query;
    } else {
      let body = this.props.onBeforeSubmit(data);
      opts.body = JSON.stringify(body);
    }
    let payload = await fetch(action, opts)
      .then(resp => {
        // agregar poder indicar el tipo de respuesta que se espera
        let payload = resp.json();
        if (typeof onDone === 'function') onDone(payload);
        return payload;
      })
      .catch(error => {
        if (typeof onError === 'function') onError(error);
        return error;
      });
    this.setState({ loading: false });
    this.clear();
    if (typeof onAfterSubmit === 'function') onAfterSubmit(payload);
  }

  onChange(data) {
    Object.assign(this.state.data, data);
    this.setState({
      data: this.state.data
    }, () => {
      if (typeof this.props.onChange === 'function')
        this.props.onChange(this.state.data);
    });
  }

  render() {
    let { action, method, className, style, children } = this.props;
    let { fields } = this.state;
    let cn = [this.constructor.name, className].join(' ');
    let $fields = Array.isArray(fields) ?
      fields.map(field => <Fields key={field.name} {...field} onChange={this.onChange} />) :
      <Fields {...fields} onChange={this.onChange} />

    return (<div className={cn} style={style}>
      <form action={action} method={method} onSubmit={this.onSubmit}>
        {this.Template ?
          <this.Template>
            {$fields}
          </this.Template> :
          $fields}
        {children}
      </form>
    </div>);
  }
}