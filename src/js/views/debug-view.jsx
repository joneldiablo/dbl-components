import React from "react";

export default class DebugView extends React.Component {

  static jsClass = 'DebugView';

  render() {
    const { children, name, view, ...props } = this.props;
    return (<div style={{ display: 'flex', border: '1px solid', padding: 5, margin: 2 }}>
      <div>
        <p>View: "{view}".</p>
        <p>name: "{name}".</p>
        <pre>
          {JSON.stringify(props, null, 2)}
        </pre>
      </div>
      <div>
        {children}
      </div>
    </div>);
  }
}