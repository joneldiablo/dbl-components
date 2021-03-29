import React from "react";
import Table from "./table";

export default class EndpointTable extends Table {

  static jsClass = 'EndpointTable';

  async componentDidMount() {
    const payload = await fetch(this.props.endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'access-token': '12345678'
      }
    }).then(r => r.json());
    this.setState({
      ...payload
    });
  }

}
