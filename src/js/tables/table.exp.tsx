import React from "react";
import { NavLink } from "react-router-dom";
import Component from "../component";

export default class Table extends Component {

  static jsClass = 'Table';
  
  column(col, data, classes, i) {
    const colStyle = {
      width: col.width,
      overflow: 'hidden'
    }
    return <div className={[col.width ? 'col-auto' : 'col', classes].join(' ')} key={i + '-' + col.name} style={colStyle}>
      {data}
    </div>
  }

  content() {
    const { columns } = this.props;
    const { data } = this.state;
    return <div style={{ overflowX: 'auto' }}>
      <div className="table-wrapper">
        <div className="table-header container-fluid">
          <div className="table-header-row row">
            {columns?.length && columns.map((col, i) =>
              this.column(col, col.label, 'table-header-column', i))}
          </div>
        </div>
        <div className="table-body container-fluid">
          {data && data.map(row =>
            <div className="table-body-row row" key={row.id}>
              {columns?.length && columns.map((col, i) => {
                const colData = (col.name === 'id' ?
                  <NavLink to={this.props.path + '/' + row[col.name]}>
                    {row[col.name]}
                  </NavLink> :
                  row[col.name]);
                return this.column(col, colData, 'table-body-column', i);
              })}
            </div>)}
        </div>
      </div>
    </div>
  }
}
