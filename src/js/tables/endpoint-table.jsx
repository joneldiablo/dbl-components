import React from "react";
import { NavLink } from "react-router-dom";
import Table from "./table";

export default class EndpointTable extends Table {

  async componentDidMount() {
    const payload = await fetch(this.props.endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': '12345678'
      }
    }).then(r => r.json());
    this.setState({
      headers: payload.data[0] && Object.keys(payload.data[0]),
      ...payload
    });
  }

  content() {
    const { headers, data } = this.state;
    return <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {headers && headers.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data && data.map(row => <tr key={row.id}>
            {headers && headers.map(col => <td key={col}>{col === 'id' ?
              <NavLink to={this.props.path + '/' + row[col]}>{row[col]}</NavLink> :
              row[col]}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  }

}