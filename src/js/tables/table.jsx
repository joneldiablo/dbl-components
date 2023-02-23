import React from "react";
import moment from "moment";

import eventHandler from "../functions/event-handler";
import deepMerge from "../functions/deep-merge";
import Component from "../component";
import fields from "../forms/fields";
import Icons from "../media/icons";
import JsonRender from "../json-render";

export const FORMATS = {
  component: (raw, props, data, jsonRender, colName) => {
    if (props.type === 'boolean') {
      props.value = !!raw;
    } else {
      props.value = raw;
    }
    props.name += '.cell';
    props.id = data.id;
    props.data = data;
    props.columnName = colName;
    return jsonRender.buildContent(props);
  },
  date: (raw, { format: f = 'DD/MM/YYYY', locale = false } = {}) =>
    raw ? locale ? moment(raw).format(f) : moment.utc(raw).format(f) : '',
  datetime: (raw, { format: f = 'DD/MM/YYYY HH:mm', locale = false } = {}) =>
    raw ? locale ? moment(raw).format(f) : moment.utc(raw).format(f) : '',
  currency: (raw, { locale = 'en-US', currency = 'USD' } = {}) =>
    ['string', 'number'].includes(typeof raw) ? (new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    })).format(raw) : '',
  number: (raw, { locale = 'en-US' } = {}) =>
    ['string', 'number'].includes(typeof raw) ?
      (new Number(raw)).toLocaleString(locale) : '',
  boolean: (raw, { 'true': True = 'Yes', 'false': False = 'Not' }) => (raw ? True : False)
}

export const addFormatTemplates = (newTemplates = {}) => {
  Object.assign(FORMATS, newTemplates);
}

export class HeaderCell extends React.Component {

  static jsClass = 'HeaderColumn';
  static defaultProps = {
    filterPos: 'down'
  }

  state = {};

  constructor(props) {
    super(props);
    this.events = [];
  }

  componentDidMount() {
    const { col } = this.props;
    if (col.filter) {
      this.events.push([col.filter.name, this.onChangeFilter]);
    }
    for (const event of this.events) {
      eventHandler.subscribe(...event);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.sort && this.state.sortDir) this.setState({ sortDir: null });
  }

  componentWillUnmount() {
    for (const event of this.events) {
      eventHandler.unsubscribe(event[0]);
    }
  }

  onChangeFilter = (data) => {
    const { filter } = this.props.col;
    const searchActive = !!(Array.isArray(data[filter.name]) ?
      data[filter.name].length : data[filter.name]);
    this.setState({ searchActive });
    eventHandler.dispatch(this.props.tableName, data);
  }

  sort(dir) {
    const { onSort, col } = this.props;
    const { sortDir } = this.state;
    let newDir = dir;
    if (sortDir === newDir) newDir = null;
    this.setState({ sortDir: newDir });
    if (typeof onSort === 'function') onSort(newDir ? { [col.name]: newDir } : null);
  }

  render() {
    const { col, classes, icons, orderable, filterPos } = this.props;
    const { sortDir, searchActive } = this.state;
    const showOrder = typeof col.orderable !== 'undefined' ? col.orderable : orderable;
    const style = {
      minWidth: col.width
    }
    const cn = [
      'header position-relative w-100',
      col.type, col.name + '-header',
      col.classes, classes
    ];
    const cnSearch = ['cursor-pointer'];
    if (!searchActive) cnSearch.push('text-muted');
    return <th className={"align-middle " + col.name}>
      <div className="d-flex align-items-center">
        <div className={cn.join(' ')} style={style}>
          <span>{col.label}</span>
        </div>
        <div className="d-flex">
          {col.filter && <div className={"ps-2 mt-1 drop" + filterPos}>
            <span data-bs-toggle="dropdown" >
              <Icons icon={icons.search} className={cnSearch.join(' ')} />
            </span>
            <div className="dropdown-menu dropdown-menu-end p-0" onClick={(e) => e.stopPropagation()} >
              {React.createElement(fields[col.filter.type] || fields.Field, col.filter)}
            </div>
          </div>}
          {showOrder && <div className="ps-2 text-muted" style={{ fontSize: 10 }}>
            <span onClick={(e) => this.sort('DESC', e)}>
              <Icons icon={icons.caretUp}
                className={'cursor-pointer ' + (sortDir === 'DESC' ? 'text-body' : '')}
              />
            </span>
            <span onClick={(e) => this.sort('ASC', e)}>
              <Icons icon={icons.caretDown}
                className={'cursor-pointer ' + (sortDir === 'ASC' ? 'text-body' : '')}
              />
            </span>
          </div>}
        </div>
      </div>
    </th>
  }
}

export default class Table extends Component {

  static jsClass = 'Table';
  static defaultProps = {
    ...Component.defaultProps,
    data: [],
    striped: true,
    hover: true,
    icons: {
      caretUp: 'caret-up',
      caretDown: 'caret-down',
      search: 'search'
    }
  }

  constructor(props) {
    super(props);
    this.jsonRender = new JsonRender(props, props.mutations);
  }

  componentDidMount() {
    this.events = [];
    Object.entries(this.props.columns).forEach(([key, col]) => {
      // TODO: mejorar esto, filtrar el componente dropdown
      // buscar una forma de que solo los componentes field carguen evento
      if (col.format === 'component' && col.formatOpts.component !== 'DropdownButtonContainer') {
        const event = [col.formatOpts.name + '.cell', this.onEventCell];
        this.events.push(event);
        eventHandler.subscribe(...event);
      }
    });
  }

  componentWillUnmount() {
    for (const [eventName] of this.events) {
      eventHandler.unsubscribe(eventName);
    }
  }

  // Events
  onSort = (orderBy) => {
    const { onChange } = this.props;
    this.setState({ orderBy: orderBy && Object.keys(orderBy).pop() });
    if (typeof onChange === 'function') onChange({ orderBy });
  }

  onEventCell = (dataRaw) => {
    const data = {};
    for (const event in dataRaw) {
      data[event.replace(/\.cell$/, '')] = dataRaw[event];
    }
    eventHandler.dispatch(this.props.name, data);
  }
  //------

  mapHeaderCell = ([key, col], i) => {
    const { colClasses, icons, orderable, name } = this.props;
    const { orderBy } = this.state;
    col.name = col.name || key;
    col.label = this.jsonRender.buildContent(col.label);
    const props = {
      col,
      orderable,
      classes: colClasses,
      icons,
      onSort: this.onSort,
      sort: orderBy === col.name,
      tableName: name
    };
    return <HeaderCell key={i + '-' + col.name} {...props} />
  }

  mapRows = (row, i) => {
    const { columns, name, mapRows: mapRowsFunc, rowContent } = this.props;
    const rowId = (row.id === 0 || !!row.id) ? row.id : i;
    const rowKey = (row.id === 0 || !!row.id) ? (i + '-' + rowId) : i;
    const cnRow = ['row-' + this.props.name, 'row-' + rowId];
    const { classes: rowClasses, ...rowProps } =
      (typeof mapRowsFunc === 'function' && mapRowsFunc(name, row, i)) || {};
    if (rowClasses) cnRow.push(rowClasses);

    const _row = <tr key={rowKey} {...rowProps} className={cnRow.join(' ')}>
      {Object.entries(columns).map(([key, col], j) => this.mapCells(row, col.name ? col : { name: key, ...col }, j))}
    </tr>;
    if (rowContent) {
      const clone = JSON.parse(JSON.stringify(rowContent));
      const _theRowContent = this.jsonRender.buildContent({ ...clone, row, name: `${clone.name}.${i}` });
      return <>
        {_row}
        <tr>
          <td colSpan="1000">
            {_theRowContent}
          </td>
        </tr>
      </>
    } else return _row;

  }

  mapCells = (rowData, col, i) => {
    const { mapCells: mapCellsFunc, name, colClasses } = this.props;
    const colName = col.name;
    const cellAttrs = {
      className: ['cell', col.type, col.name + '-cell', col.classes, colClasses],
      style: col.style,
      title: typeof rowData[colName] !== 'object' ? rowData[colName] : undefined
    }

    const mutation = typeof mapCellsFunc === 'function' && mapCellsFunc(name, col.name, rowData) || {};
    let formatOptions;
    if (col.formatOpts) {
      formatOptions = deepMerge({ ...col.formatOpts }, mutation);
    } else {
      if (mutation.classes) {
        const classes = mutation.classes;
        delete mutation.classes;
        cellAttrs.className.push(classes);
      }
      deepMerge(cellAttrs, mutation);
    }
    cellAttrs.className = cellAttrs.className.flat().join(' ');

    const formater = FORMATS[col.format] || (raw => raw);
    const cellData = typeof rowData[col.name] !== 'undefined' ? rowData[col.name] : true;

    const cell = (<div {...cellAttrs}> {formater(cellData, formatOptions, rowData, this.jsonRender, colName)}  </div>);
    return (colName === 'id' ?
      <th key={i + '-' + colName} className={colName} scope="row">{cell}</th> :
      <td key={i + '-' + colName} className={colName} >{cell}</td>
    );
  }

  content(children = this.props.children) {
    const { data, columns, headerClasses, hover, striped } = this.props;
    let header, footer;
    if (Array.isArray(children))
      [header, footer] = children;
    const cn = ['table'];
    if (striped) cn.push('table-striped');
    if (hover) cn.push('table-hover');
    return <table className={cn.join(' ')}>
      <thead>
        {header &&
          <tr>
            <td colSpan="1000">
              <div>{header}</div>
            </td>
          </tr>
        }
        <tr className={headerClasses}>
          {Object.entries(columns).map(this.mapHeaderCell)}
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
  }
}