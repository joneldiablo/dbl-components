import PropTypes from 'prop-types';
import React, { createRef } from "react";

import {
  eventHandler,
  deepMerge,
  t,
  formatValue,
  resolveRefs
} from "dbl-utils";

import { ptClasses } from "../prop-types";
import fields from "../forms/fields";
import Icons from "../media/icons";
import Action from "../actions/action";
import JsonRender from "../json-render";
import Component from "../component";
import FloatingContainer from '../containers/floating-container/floating-container';

/**
 * @typedef {Object} FormatOptions
 * @property {string} [format] - Formato para fechas y horas.
 * @property {boolean} [locale] - Si se debe considerar la zona horaria local.
 * @property {string} [currency] - Código de moneda para el formato de moneda.
 * @property {string} ['true'] - Representación en cadena de un valor booleano `true`.
 * @property {string} ['false'] - Representación en cadena de un valor booleano `false`.
 */

/**
 * Objeto con funciones de formateo para diferentes tipos de datos.
 * 
 * @namespace
 * @property {function(any, Object, Object, Object, string): React.Component} component - Formatea los datos a un componente.
 * @property {function(any, FormatOptions=): string} date - Formatea los datos a una fecha.
 * @property {function(any, FormatOptions=): string} datetime - Formatea los datos a un datetime.
 * @property {function(any, FormatOptions=): string} currency - Formatea los datos a una moneda.
 * @property {function(any, FormatOptions=): string} number - Formatea los datos a un número.
 * @property {function(any, Object): string} boolean - Formatea los datos a un booleano.
 */
export const FORMATS = {
  /**
   * Formatea los datos en crudo a un componente.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} props - Propiedades del componente.
   * @param {Object} data - Datos de la celda.
   * @param {Object} jsonRender - Instancia de JsonRender.
   * @param {String} colName - Nombre de la columna.
   * @returns {React.Component} El componente formateado.
   */
  component: (raw, rawprops, data, jsonRender, colName) => {
    const props = resolveRefs(rawprops, { data });
    if (props.type === 'boolean') {
      props.value = !!raw;
    } else {
      props.value = raw;
    }
    props.name = [props.name].flat().filter(Boolean).join('-') + '.cell';
    props.id = data.id;
    props.data = data;
    props.columnName = colName;
    return jsonRender.buildContent(props);
  },
  /**
   * Formatea los datos en crudo a una fecha.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato de la fecha.
   * @returns {String} La fecha formateada.
   */
  date: (raw, params = {}) =>
    typeof raw !== 'string' ? (params.empty || '') : formatValue(raw, Object.assign(params, { format: 'date' })),
  /**
   * Formatea los datos en crudo a un datetime.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato del datetime.
   * @returns {String} El datetime formateado.
   */
  datetime: (raw, params = {}) =>
    typeof raw !== 'string' ? (params.empty || '') : formatValue(raw, Object.assign(params, { format: 'datetime' })),
  time: (raw, params = {}) =>
    typeof raw !== 'string' ? (params.empty || '') : formatValue(raw, Object.assign(params, { format: 'time' })),
  /**
   * Formatea los datos en crudo a una moneda.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato de la moneda.
   * @returns {String} La moneda formateada.
   */
  currency: (raw, params = {}) =>
    typeof raw !== 'number' ? (params.empty || '') : formatValue(raw, Object.assign(params, { format: 'currency' })),
  /**
   * Formatea los datos en crudo a un número.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato del número.
   * @returns {String} El número formateado.
   */
  number: (raw, params = {}) =>
    typeof raw !== 'number' ? (params.empty || '') : formatValue(raw, Object.assign(params, { format: 'number' })),
  /**
   * Formatea los datos en crudo a un booleano.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato del booleano.
   * @returns {String} El booleano formateado.
   */
  boolean: (raw, { 'true': True = 'Yes', 'false': False = 'Not' }) => (raw ? True : False)
}

/**
 * Agrega nuevas plantillas de formato al objeto FORMATS.
 *
 * Esta función utiliza `Object.assign` para fusionar las plantillas proporcionadas en el objeto FORMATS existente.
 * Esto significa que si una plantilla con el mismo nombre ya existe en FORMATS, la nueva plantilla la sobrescribirá.
 *
 * @function
 * @param {Object} newTemplates - Un objeto que contiene plantillas de formato a agregar. Las claves son los nombres de las plantillas y los valores son las funciones de formato.
 * @returns {void}
 * @example
 * 
 * addFormatTemplates({
 *   newFormat: (raw, options) => { ... },
 *   anotherFormat: (raw, options) => { ... }
 * });
 */
export const addFormatTemplates = (newTemplates = {}) => {
  Object.assign(FORMATS, newTemplates);
}

/**
 * Componente de celda de encabezado para una tabla.
 *
 * @class HeaderCell
 * @extends {React.Component}
 */
export class HeaderCell extends React.Component {

  static propTypes = {
    col: PropTypes.any,
    icons: PropTypes.any,
    orderable: PropTypes.bool,
    classes: PropTypes.oneOfType([
      PropTypes.string, PropTypes.object,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    headerClasses: PropTypes.oneOfType([
      PropTypes.string, PropTypes.object,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    orderClasses: PropTypes.oneOfType([
      PropTypes.string, PropTypes.object,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    orderActiveClasses: PropTypes.oneOfType([
      PropTypes.string, PropTypes.object,
      PropTypes.arrayOf(PropTypes.string)
    ]),
    dropFilters: PropTypes.object.isRequired,
    headerRefs: PropTypes.object.isRequired,
    tableName: PropTypes.string,
    vertical: PropTypes.bool
  }

  static jsClass = 'HeaderColumn';
  static defaultProps = {
  }

  state = {
    searchActive: false
  };

  constructor(props) {
    super(props);
    this.events = [];
    this.ref = createRef();
  }

  /**
   * Método de ciclo de vida de React que se llama cuando el componente se ha montado.
   * Se suscribe a eventos relevantes para este componente.
   */
  componentDidMount() {
    const { col } = this.props;
    if (col.filter) {
      this.events.push([col.filter.name, this.onChangeFilter]);
      this.events.push(['update.' + col.filter.name, this.onUpdateFilter.bind(this)]);
    }
    for (const event of this.events) {
      eventHandler.subscribe(...event);
    }
  }

  /**
   * Método de ciclo de vida de React que se llama cuando el componente se actualiza.
   * Restablece la dirección de la clasificación si la clasificación se ha eliminado.
   * @param {Object} prevProps - Las propiedades anteriores del componente.
   * @param {Object} prevState - El estado anterior del componente.
   */
  componentDidUpdate(prevProps, prevState) {
    if (!this.props.sort && this.state.sortDir) this.setState({ sortDir: null });
  }

  /**
   * Método de ciclo de vida de React que se llama cuando el componente está a punto de desmontarse.
   * Cancela la suscripción a todos los eventos a los que se suscribió en componentDidMount.
   */
  componentWillUnmount() {
    for (const event of this.events) {
      eventHandler.unsubscribe(event[0]);
    }
  }

  /**
   * Manejador de eventos para cambios en el filtro.
   * @param {Object} data - Los datos del evento.
   */
  onChangeFilter = (data) => {
    const { filter } = this.props.col;
    const searchActive = !!(Array.isArray(data[filter.name]) ?
      data[filter.name].length : data[filter.name]);
    this.setState({ searchActive });
    eventHandler.dispatch(this.props.tableName, data);
  }

  onUpdateFilter({ value, reset }) {
    if (value !== undefined) {
      const searchActive = !!(Array.isArray(value) ? value.length : value);
      this.setState({ searchActive });
    }
    if (reset) {
      this.setState({ searchActive: false });
    }
  }

  /**
   * Realiza la acción de ordenar las celdas en el encabezado.
   * @param {string} dir - La dirección en la que se va a realizar la ordenación.
   */
  sort(dir) {
    const { onSort, col } = this.props;
    const { sortDir } = this.state;
    let newDir = dir;
    if (sortDir === newDir) newDir = null;
    this.setState({ sortDir: newDir });
    const dispatchData = { [col.name]: newDir };
    if (typeof onSort === 'function') onSort(newDir ? dispatchData : null);
    eventHandler.dispatch('order.' + this.props.tableName, dispatchData);
  }

  /**
   * Renderiza el componente.
   * @returns {React.Component} El componente renderizado.
   */
  render() {
    const {
      col, classes, icons, orderable, vertical,
      headerClasses, orderClasses, orderActiveClasses
    } = this.props;
    const { sortDir, searchActive } = this.state;
    const showOrder = typeof col.orderable !== 'undefined' ? col.orderable : orderable;
    const style = {
      minWidth: col.width
    }
    const cn = [
      'header position-relative flex-grow-1',
      col.type, col.name + '-header',
      col.classes, classes
    ];
    if (!vertical) cn.push('w-100', col.hClasses, col.hHeadClasses);
    else cn.push('my-1 pe-2 d-inline-block', col.vClasses, col.vHeadClasses);

    const cnSearch = ['search'];
    if (!!searchActive) cnSearch.push('active');
    else cnSearch.push('opacity-75');

    const oc = ['', orderClasses];
    if (!sortDir) oc.push('opacity-50');


    const hClasses = ["align-middle", col.name];
    if (headerClasses) hClasses.push(headerClasses);

    const odescc = ['cursor-pointer'];
    const oascc = ['cursor-pointer'];
    if (sortDir === 'ASC') {
      odescc.push(orderActiveClasses);
      oascc.push('opacity-50');
    }
    if (sortDir === 'DESC') {
      oascc.push(orderActiveClasses);
      odescc.push('opacity-50');
    }

    this.props.headerRefs[col.name] = this.ref;
    if (col.filter?.name) {
      this.props.dropFilters[col.name] = React.createElement(FloatingContainer,
        {
          name: `${col.name}-${this.props.tableName}-floatingFilter`,
          floatAround: this.ref,
          active: false,
          placement: 'bottom-start',
          allowedPlacements: ['bottom-start', 'top-start', 'bottom-end', 'top-end']
        },
        (typeof col.filter.showClear === 'boolean' ? col.filter.showClear : true) &&
        searchActive && React.createElement(Action,
          {
            name: col.name + 'Clear',
            classes: "btn-link btn-sm p-0",
            style: { top: 5, position: 'absolute', right: 8, zIndex: 4 }
          },
          React.createElement(Icons,
            { icon: icons.clear, classes: "text-danger" })
        ),
        React.createElement(fields[col.filter.component] || fields[col.filter.type] || fields.Field, col.filter)
      );
    }

    const _actions = [
      col.filter && React.createElement(Action, {
        tag: 'div',
        classButton: false,
        name: `${col.name}-${this.props.tableName}-triggerFilter`,
        open: `${col.name}-${this.props.tableName}-floatingFilter`,
        classes: cnSearch.flat().filter(Boolean).join(' '),
        icon: icons.search,
        style: { minWidth: '1.2rem' }
      }),
      showOrder && React.createElement('div',
        { className: oc.flat().filter(Boolean).join(' '), style: { fontSize: 10 } },
        React.createElement('span',
          { onClick: (e) => this.sort('ASC', e) },
          React.createElement(Icons, {
            icon: icons.caretUp,
            className: odescc.flat().filter(Boolean).join(' ')
          })
        ),
        React.createElement('span',
          { onClick: (e) => this.sort('DESC', e) },
          React.createElement(Icons, {
            icon: icons.caretDown,
            className: oascc.flat().filter(Boolean).join(' ')
          })
        )
      )
    ];

    return React.createElement('th',
      { className: hClasses.filter(Boolean).flat().join(' '), scope: "col", ref: this.ref },
      React.createElement('div',
        { className: (vertical ? '' : 'd-flex') + " align-items-center gap-3" },
        React.createElement('div',
          { className: cn.filter(Boolean).flat().join(' '), style },
          col.label
        ),
        (col.filter || showOrder)
        && React.createElement('div', {
          className: 'd-flex align-items-center flex-shrink-1 justify-content-end gap-2 filter-order-container'
            + (vertical ? ' float-end my-2' : '')
        }, ..._actions)
      )
    )
  }

}

/**
* Clase base para la tabla.
*
* Este componente es responsable de renderizar una tabla a partir de un conjunto de datos proporcionado.
* También proporciona funcionalidad para ordenar, filtrar y manejar eventos.
*
* @class Table
* @extends {Component}
*/
export default class Table extends Component {

  static jsClass = 'Table';
  static propTypes = {
    ...Component.propTypes,
    colClasses: ptClasses,
    headerClasses: ptClasses,
    tableClasses: ptClasses,
    orderClasses: ptClasses,
    orderActiveClasses: ptClasses,
    columns: PropTypes.any,
    data: PropTypes.any,
    hover: PropTypes.any,
    icons: PropTypes.any,
    mapCells: PropTypes.any,
    mapRows: PropTypes.any,
    mutations: PropTypes.any,
    onChange: PropTypes.any,
    orderable: PropTypes.any,
    striped: PropTypes.any,
    vertical: PropTypes.bool,
    headerCustom: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.string]),
    columnsCustom: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.string]),
    footerCustom: PropTypes.oneOfType([PropTypes.element, PropTypes.bool, PropTypes.string]),
  }
  static defaultProps = {
    ...Component.defaultProps,
    data: [],
    striped: true,
    hover: true,
    icons: {
      caretUp: 'caret-up',
      caretDown: 'caret-down',
      search: 'search',
      clear: 'x'
    },
    vertical: false,
    orderClasses: '',
    orderActiveClasses: ''
  }

  constructor(props) {
    super(props);
    const { mutations, ...propsJ } = props;
    this.jsonRender = new JsonRender(propsJ, mutations);
    this.state.dropFilters = {};
    this.state.headerRefs = {};
  }

  /**
   * Subscribes to the events when the component is mounted.
   *
   * @method componentDidMount
   * @memberof Table
   */
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

  /**
   * Unsubscribes from the events when the component is unmounted.
   *
   * @method componentWillUnmount
   * @memberof Table
   */
  componentWillUnmount() {
    for (const [eventName] of this.events) {
      eventHandler.unsubscribe(eventName);
    }
  }

  // Events
  /**
   * Handles sorting event.
   *
   * @method onSort
   * @param {Object} orderBy - An object representing the column to be sorted.
   * @memberof Table
   */
  onSort = (orderBy) => {
    const { onChange } = this.props;
    this.setState({ orderBy: orderBy && Object.keys(orderBy).pop() });
    if (typeof onChange === 'function') onChange({ orderBy });
  }

  /**
   * Handles cell events.
   *
   * @method onEventCell
   * @param {Object} dataRaw - Raw data of the event.
   * @memberof Table
   */
  onEventCell = (dataRaw) => {
    const data = {};
    for (const event in dataRaw) {
      data[event.replace(/\.cell$/, '')] = dataRaw[event];
    }
    eventHandler.dispatch(this.props.name, data);
  }
  //------

  /**
   * Maps HeaderCell components for each column.
   *
   * @method mapHeaderCell
   * @param {Array} args - The column properties.
   * @param {number} i - The index of the column.
   * @returns {React.Component} - A HeaderCell component.
   * @memberof Table
   */
  mapHeaderCell = ([key, col], i) => {
    const {
      colClasses, headerClasses,
      icons, orderable, name, vertical,
      orderClasses, orderActiveClasses
    } = this.props;
    const { orderBy } = this.state;
    col.name = col.name || key;
    col.label = this.jsonRender.buildContent(col.label);
    const props = {
      col,
      orderable,
      classes: colClasses,
      headerClasses,
      icons,
      onSort: this.onSort,
      sort: orderBy === col.name,
      tableName: name,
      orderClasses,
      orderActiveClasses,
      dropFilters: this.state.dropFilters,
      headerRefs: this.state.headerRefs,
      vertical
    };

    return React.createElement(HeaderCell, { key: i + '-' + col.name, ...props });
  }

  /**
   * Provides properties for a row.
   *
   * @method rowProps
   * @param {Object} rowOrColumn - The data of the row or column.
   * @param {number} i - The index of the row or column.
   * @returns {Object} - Properties for the row.
   * @memberof Table
   */
  rowProps = (rowOrColumn, i) => {
    const { name, mapRows: mapRowsFunc, vertical } = this.props;
    const id = vertical ? rowOrColumn.name : rowOrColumn.id;
    const rowKey = (!!id || id === 0) ? (i + '-' + id) : i;
    const cnRow = ['row-' + this.props.name, 'row-' + ((!!id || id === 0) ? id : i)];
    const { classes: rowClasses, ...rowProps } =
      (typeof mapRowsFunc === 'function' && mapRowsFunc(name, rowOrColumn, i)) || {};
    if (rowClasses) cnRow.push(rowClasses);

    return {
      key: rowKey,
      ...rowProps,
      className: cnRow.filter(Boolean).flat().join(' ')
    };
  };

  /**
   * Maps cell components for each cell in a row.
   *
   * @method mapCell
   * @param {Object} rowData - The data of the row.
   * @param {Object} col - The properties of the column.
   * @param {number} i - The index of the cell.
   * @returns {React.Component} - A cell component.
   * @memberof Table
   */
  mapCell = (rowData, col, i) => {
    const { mapCells: mapCellsFunc, name, colClasses, vertical } = this.props;
    const colName = col.name;
    const className = ['cell', col.type, col.name + '-cell', col.classes, colClasses];

    if (vertical) {
      className.push(col.vClasses, col.vCellClasses);
    } else {
      className.push(col.hClasses, col.hCellClasses);
    }

    const cellAttrs = {
      className,
      style: vertical
        ? {
          minWidth: col.width,
          ...col.style
        }
        : {
          paddingRight: `var(--${colName}-${name}-Table)`,
          ...col.style
        },
      title: rowData[colName] !== undefined ? rowData[colName].toString() : null
    }

    const mutation = typeof mapCellsFunc === 'function' && mapCellsFunc(name, col.name, rowData, { cellAttrs, fullColumn: col }) || {};
    let formatOptions;
    if (col.formatOpts) {
      deepMerge.setConfig({
        fix: (target, source) => React.isValidElement(source) || React.isValidElement(target) ? source : undefined
      });
      formatOptions = deepMerge({ ...col.formatOpts }, mutation);
    } else {
      if (mutation.classes) {
        const classes = mutation.classes;
        delete mutation.classes;
        cellAttrs.className.push(classes);
      }
      deepMerge.setConfig({
        fix: (target, source) => React.isValidElement(source) || React.isValidElement(target) ? source : undefined
      });
      deepMerge(cellAttrs, mutation);
    }
    cellAttrs.className = cellAttrs.className.filter(Boolean).flat().join(' ');

    const formater = FORMATS[col.format] || ((raw, opts) => ((raw === '' || typeof raw !== 'string') && opts.empty) || t(raw, opts.context));
    const cellData = typeof rowData[col.name] !== 'undefined' ? rowData[col.name] : true;

    const cell = React.createElement('div',
      { ...cellAttrs },
      formater(cellData, formatOptions || col, rowData, this.jsonRender, colName));
    return (colName === 'id'
      ? React.createElement('th',
        { key: i + '-' + colName, className: colName, scope: "row" },
        cell
      )
      : React.createElement('td',
        {
          key: i + '-' + colName,
          className: vertical ? [colName, 'row-' + (i - 1)].filter(Boolean).flat().join(' ') : colName
        },
        cell
      )
    );
  }

  /**
   * Renders the table content.
   *
   * @method content
   * @param {Array} children - Optional children to be rendered in the table.
   * @returns {React.Component} - The rendered table.
   * @memberof Table
   */
  content(children = this.props.children) {
    const {
      data, columns, tableClasses,
      hover, striped, vertical, disabled,
      headerCustom, columnsCustom, footerCustom
    } = this.props;
    // Definir encabezado y pie de página si están presentes
    let header, footer;
    if (Array.isArray(children))
      ([header, footer] = children);

    // Construcción de las clases CSS para la tabla
    const cn = ['table'];
    if (striped) cn.push('table-striped');
    if (hover) cn.push('table-hover');
    if (tableClasses) cn.push(tableClasses);
    if (vertical) cn.push('vertical');
    if (disabled) cn.push('disabled');

    // Inicialización de los datos de la tabla según la disposición (vertical/horizontal)
    const tableData = [];

    // Procesamiento de los datos para construir la estructura de la tabla
    Object.entries(columns).forEach(([key, col], j) => {
      const column = col.name ? col : { name: key, ...col };

      if (vertical) {
        if (!tableData[j]) tableData[j] = { cells: [], data: column };
        tableData[j].cells[0] = this.mapHeaderCell([key, column], 0);
      }

      data.forEach((row, i) => {
        const k = vertical ? i + 1 : i;
        const [x, y] = vertical ? [k, j] : [j, k];
        if (!tableData[y]) tableData[y] = { cells: [], data: row };
        tableData[y].cells[x] = this.mapCell(row, column, x);
      });

    });

    const cssHeaderVars = Object.entries(this.state.headerRefs).reduce((chv, [colName, hRef]) => {
      const foc = hRef.current?.querySelector('.filter-order-container');
      if (!foc) return chv;
      const colNameLabel = foc.parentElement.querySelector(`.${colName}-header`);
      const pTotal = foc.parentElement.clientWidth - colNameLabel.clientWidth;
      chv[`--${colName}-${this.props.name}-Table`] = pTotal + 'px';
      return chv;
    }, {});

    // Renderización de la tabla con las estructuras de encabezado, cuerpo y pie de página
    const finalTable = React.createElement('table', {
      className: cn.filter(Boolean).flat().join(' '),
      style: {
        ...cssHeaderVars
      }
    },
      React.createElement('thead', {},
        header && (
          React.createElement('tr', {},
            React.createElement('td', { colSpan: "1000" },
              React.createElement('div', {}, header)
            )
          )
        ),
        ...[headerCustom].flat().filter(Boolean),
        !vertical && (
          React.createElement('tr', {},
            Object.entries(columns).map(this.mapHeaderCell)
          )
        ),
        ...[columnsCustom].flat().filter(Boolean),
      ),
      React.createElement('tbody', {},
        tableData.map(({ cells, data }, i) =>
          React.createElement('tr', { ...this.rowProps(data, i) }, cells)
        )
      ),
      (footer || footerCustom) && (
        React.createElement('tfoot', {},
          ...[footerCustom].flat().filter(Boolean),
          footer && React.createElement('tr', {},
            React.createElement('td', { colSpan: "1000" },
              React.createElement('div', {}, footer)
            )
          )
        )
      )
    );
    return Object.keys(this.state.dropFilters).length
      ? React.createElement(React.Fragment, {},
        finalTable, ...Object.values(this.state.dropFilters))
      : finalTable
  }

}