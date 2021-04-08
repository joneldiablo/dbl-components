import React from "react";
import moment from "moment";
import parseReact from "html-react-parser";
import Component from "../component";
import fields from "../forms/fields";
import COMPONENTS from "../components";
import Icons from "../media/icons";
import eventHandler from "../functions/event-handler";

const FORMATS = {
  component: (raw, props, data) => {
    const buildContent = (content, index) => {
      if (!content) return false;
      else if (typeof content === 'string') {
        return (<React.Fragment key={index + '-' + content.name}>
          {parseReact(content)}
        </React.Fragment>);
      } else if (React.isValidElement(content)) {
        content.key = index + '-' + content.name;
        return content;
      }
      else if (Array.isArray(content)) return content.map(buildContent);
      else if (typeof content === 'object' && typeof content.name !== 'string')
        return Object.keys(content)
          .map((name, i) => buildContent({ name, ...content[name] }, i));

      if (typeof content.active === 'boolean' && !content.active) return false;
      const { component: componentName, content: subContent, ...section } = content;
      let Component = COMPONENTS[componentName] || (COMPONENTS.Component);
      let children = buildContent(subContent);
      if (props.valueIn === section.name) {
        section.value = raw;
      }
      return (<Component key={index + '-' + section.name} {...section}>
        {children}
      </Component>);
    }
    if (props.type === 'boolean') {
      props.value = !!raw;
    } else {
      props.value = raw;
    }
    props.name += '.cell';
    props.id = data.id;
    props.data = data;
    return buildContent(props);
  },
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

export class HeaderCell extends React.Component {

  static jsClass = 'HeaderColumn';

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
    this.setState({ searchActive: !!data[filter.name] });
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
    const { col, classes, icons, orderable } = this.props;
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
    return <th className="align-middle">
      <div className="d-flex align-items-center">
        <div className={cn.join(' ')} style={style}>
          <span>{col.label}</span>
        </div>
        <div className="d-flex">
          {col.filter && <div className="ps-2 mt-1 dropstart">
            <span data-bs-toggle="dropdown" >
              <Icons icon={icons.search} className={cnSearch.join(' ')} />
            </span>
            <div className="dropdown-menu dropdown-menu-end p-0">
              {/*TODO: Cambiar ícono y color cuando haya un filtro*/}
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
    icons: {
      caretUp: 'caret-up',
      caretDown: 'caret-down',
      search: 'search'
    }
  }

  componentDidMount() {
    this.events = [];
    this.props.columns.forEach(col => {
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

  mapHeaderCell = (col, i) => {
    const { colClasses, icons, orderable, name } = this.props;
    const { orderBy } = this.state;
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
    const { columns } = this.props;
    return <tr key={i + '-' + row.id} >
      {columns.map((col, j) => this.mapCells(row, col, j))}
    </tr>
  }

  mapCells = (rowData, col, i) => {
    const { colClasses } = this.props;
    const colName = col.name;
    const style = {
      ...col.style
    }
    const cn = ['cell', col.type, col.name + '-cell', col.classes, colClasses];
    const cell = (<div className={cn.join(' ')} style={style} title={rowData[colName]}>
      {this.format(col, rowData)}
    </div>);
    return (colName === 'id' ?
      <th key={i + '-' + colName} scope="row">{cell}</th> :
      <td key={i + '-' + colName} >{cell}</td>
    );
  }

  format(col, rowData) {
    const formater = FORMATS[col.format] || (raw => raw);
    const cellData = rowData[col.name] || true;
    let formatOpts = {};
    if (col.formatOpts) formatOpts = JSON.parse(JSON.stringify(col.formatOpts));
    return formater(cellData, formatOpts, rowData);
  }

  content(children = this.props.children) {
    const { data } = this.props;
    const { columns } = this.props;
    let header, footer;
    if (Array.isArray(children))
      [header, footer] = children;
    return <table className="table table-striped table-hover">
      <thead>
        {header &&
          <tr>
            <td colSpan="1000">
              <div>{header}</div>
            </td>
          </tr>
        }
        <tr>
          {columns.map(this.mapHeaderCell)}
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