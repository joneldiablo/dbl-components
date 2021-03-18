import React from "react";
import Component from "../component";
import fields from "../forms/fields";
import Icons from "../media/icons";
import moment from "moment";

const FORMATS = {
  date: (raw, { format: f = 'DD/MM/YYYY' } = {}) => moment(raw).format(f),
  currency: (raw, { locale = 'en-US', currency = 'USD' } = {}) =>
    (new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    })).format(raw),
  number: (raw, { locale = 'en-US' } = {}) => (new Number(raw)).toLocaleString(locale)
}

export const addFormatTemplates = (newTemplates = {}) => {
  Object.assign(FORMATS, newTemplates);
}

export class HeaderColumn extends React.Component {

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
    const cn = [
      'header position-relative w-100',
      col.type, col.name + '-header',
      col.classes, classes
    ];
    return <th className="align-middle">
      <div className="d-flex align-items-center">
        <div className={cn.join(' ')} style={style}>
          <span>{col.label}</span>
        </div>
        <div className="d-flex">
          {col.filter && <div className="ps-2 mt-1 dropstart">
            <Icons icon={icons.search} className="cursor-pointer"
              data-bs-toggle="dropdown" />
            <div className="dropdown-menu dropdown-menu-end p-0">
              {/*TODO: Cambiar ícono y color cuando haya un filtro*/}
              {React.createElement(fields[col.filter.type] || fields.Field, col.filter)}
            </div>
          </div>}
          {showOrder && <div className="ps-2 text-muted" style={{ fontSize: 10 }}>
            <Icons icon={icons.caretUp}
              className={'cursor-pointer ' + (sortDir === 'DESC' ? 'text-body' : '')}
              onClick={(e) => this.sort('DESC', e)} />
            <Icons icon={icons.caretDown}
              className={'cursor-pointer ' + (sortDir === 'ASC' ? 'text-body' : '')}
              onClick={(e) => this.sort('ASC', e)} />
          </div>}
        </div>
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
      search: 'search'
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

  mapRows = (row, i) => {
    const { columns } = this.props;
    return <tr key={i + '-' + row.id} >
      {columns.map((col, j) => this.mapCells(row, col, j))}
    </tr>
  }

  mapCells = (row, col, i) => {
    const { colClasses } = this.props;
    const colName = col.name;
    const style = {
      ...col.style
    }
    const cn = ['cell', col.type, col.name + '-cell', col.classes, colClasses];
    const cell = (<div className={cn.join(' ')} style={style} title={row[colName]}>
      {this.format(col, row[colName])}
    </div>);
    return (colName === 'id' ?
      <th key={i + '-' + colName} scope="row">{cell}</th> :
      <td key={i + '-' + colName} >{cell}</td>
    );
  }

  format(col, data) {
    const formater = FORMATS[col.format] || (raw => raw);
    return formater(data, col.formatOpts);
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