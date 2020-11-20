import React from "react";
import flatten from "flat";
import schemaManager from "../functions/schema-manager"
import Field from "./fields/field";

export default class Form extends React.Component {

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
    style: {}
  }

  constructor(props) {
    super(props);
    
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
    let { action, method, headers, onAfterSubmit, onDone, onError } = this.props;
    let { loading, data } = this.state;
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
      console.log('query:', query);
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

  onChange(e) {
    this.state.data[e.target.name] = e.target.value;
    this.setState({
      data: this.state.data
    });
    if (typeof this.props.onChange === 'function')
      this.props.onChange(e, data);
  }

  render() {
    let { action, method, className, style } = this.props;
    let { fields } = this.state;
    let cn = [this.constructor.name, className].join(' ');
    let $fields = Array.isArray(fields) ?
      fields.map(field => <Field key={field.name} {...field} />) :
      <Field {...fields} onChange={this.onChange} />

    return (<div className={cn} style={style}>
      {action ?
        <form action={action} method={method} onSubmit={this.onSubmit}>
          {$fields}
          <div className="px-2 mb-2">
            <button className="btn btn-primary btn-block" type="submit">Enviar</button>
          </div>
        </form> :
        $fields
      }
    </div>);
  }
}