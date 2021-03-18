import React from "react";
import Component from "../component";
import Icons from "../media/icons";

class HeaderColumn extends React.Component {

  state = {};

  sort(dir) {
    const { onSort, col } = this.props;
    const { sortDir } = this.state;
    let newDir = dir;
    if (sortDir === newDir) newDir = null;
    this.setState({ sortDir: newDir });
    if (typeof onSort === 'function') onSort(newDir ? { [col.name]: newDir } : null);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.sort && this.state.sortDir) this.setState({ sortDir: null });
  }

  render() {
    const { col, classes, icons, orderable } = this.props;
    const { sortDir } = this.state;
    const showOrder = typeof col.orderable !== 'undefined' ? col.orderable : orderable;
    const style = {
      minWidth: col.width
    }
    const cn = ['header position-relative', col.type, col.name + '-header', col.classes, classes];
    if (showOrder) cn.push('pe-3 me-2');
    return <th className="align-middle">
      <div className={cn.join(' ')} style={style}>
        <span>{col.label}</span>
        {showOrder &&
          <small className="text-muted d-flex flex-column position-absolute top-50 start-100 translate-middle" style={{ fontSize: 10 }}>
            <Icons icon={icons.caretUp}
              className={'cursor-pointer ' + (sortDir === 'ASC' ? 'text-body' : '')}
              onClick={(e) => this.sort('ASC', e)} />
            <Icons icon={icons.caretDown}
              className={'cursor-pointer ' + (sortDir === 'DESC' ? 'text-body' : '')}
              onClick={(e) => this.sort('DESC', e)} />
          </small>}
      </div>
    </th>
  }
}

export default class Table extends Component {

  static defaultProps = {
    ...Component.defaultProps,
    data: [],
    icons: {
      caretUp: 'caret-up',
      caretDown: 'caret-down',
    }
  }

  // Events
  onSort = (orderBy) => {
    const { onChange } = this.props;
    this.setState({ orderBy: orderBy && Object.keys(orderBy).pop() });
    if (typeof onChange === 'function') onChange({ orderBy });
  }
  //------

  mapHeaderColumns = (col, i) => {
    const { colClasses, icons, orderable } = this.props;
    const { orderBy } = this.state;
    const props = {
      col,
      orderable,
      classes: colClasses,
      icons,
      onSort: this.onSort,
      sort: orderBy === col.name
    };
    return <HeaderColumn key={i + '-' + col.name} {...props} />
  }

  mapRowColumns = (row, col, i) => {
    const { colClasses } = this.props;
    const colName = col.name;
    const style = {
      ...col.style
    }
    const cn = ['cell', col.type, col.name + '-cell', col.classes, colClasses];
    const cell = (<div className={cn.join(' ')} style={style}>{row[colName]}</div>);
    return (colName === 'id' ?
      <th key={i + '-' + colName} scope="row">{cell}</th> :
      <td key={i + '-' + colName} >{cell}</td>
    );
  }

  mapRows = (row, i) => {
    const { columns } = this.props;
    return <tr key={i + '-' + row.id} >
      {columns.map((col, j) => this.mapRowColumns(row, col, j))}
    </tr>
  }

  content(children = this.props.children) {
    const { data } = this.props;
    const { columns } = this.props;
    let header, footer;
    if (Array.isArray(children))
      [header, footer] = children;
    return <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          {header &&
            <tr>
              <td colSpan="1000">
                <div>{header}</div>
              </td>
            </tr>
          }
          <tr>
            {columns.map(this.mapHeaderColumns)}
          </tr>
        </thead>
        <tbody>
          {data.map(this.mapRows)}
        </tbody>
        {footer &&
          <tfooter>
            <tr>
              <td colSpan="1000">
                <div>{footer}</div>
              </td>
            </tr>
          </tfooter>
        }
      </table>
    </div>
  }
}