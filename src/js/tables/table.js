import PropTypes from 'prop-types';
import React from "react";
import moment from "moment";

import eventHandler from "../functions/event-handler";
import deepMerge from "../functions/deep-merge";
import t from '../functions/i18n';
import resolveRefs from '../functions/resolve-refs';
import fields from "../forms/fields";
import Icons from "../media/icons";
import DropdownContainer from "../containers/dropdown-container";
import Action from "../actions/action";
import JsonRender from "../json-render";
import Component from "../component";

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
  date: (raw, { format: f = 'DD/MM/YYYY', locale = false } = {}) =>
    raw ? locale ? moment(raw).format(f) : moment(raw).format(f) : '',
  /**
   * Formatea los datos en crudo a un datetime.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato del datetime.
   * @returns {String} El datetime formateado.
   */
  datetime: (raw, { format: f = 'DD/MM/YYYY HH:mm', locale = false, options } = {}) =>
    raw ? locale ? moment(raw, options).format(f) : moment(raw, options).format(f) : '',
  /**
   * Formatea los datos en crudo a una moneda.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato de la moneda.
   * @returns {String} La moneda formateada.
   */
  currency: (raw, { locale = 'en-US', currency = 'USD' } = {}) =>
    ['string', 'number'].includes(typeof raw) ? (new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    })).format(raw) : '',
  /**
   * Formatea los datos en crudo a un número.
   *
   * @function
   * @param {any} raw - Los datos en crudo que deben ser formateados.
   * @param {Object} options - Opciones de formato del número.
   * @returns {String} El número formateado.
   */
  number: (raw, { locale = 'en-US' } = {}) =>
    ['string', 'number'].includes(typeof raw) ?
      (new Number(raw)).toLocaleString(locale) : '',
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
    filterPos: PropTypes.any,
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
    ])
  }

  static jsClass = 'HeaderColumn';
  static defaultProps = {
    filterPos: 'down'
  }

  state = {
    searchActive: false
  };

  constructor(props) {
    super(props);
    this.events = [];
  }

  /**
   * Método de ciclo de vida de React que se llama cuando el componente se ha montado.
   * Se suscribe a eventos relevantes para este componente.
   */
  componentDidMount() {
    const { col } = this.props;
    if (col.filter) {
      this.events.push([col.filter.name, this.onChangeFilter]);
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
      col, classes, icons, orderable,
      filterPos, headerClasses,
      orderClasses, orderActiveClasses
    } = this.props;
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
    if (!searchActive) cnSearch.push('opacity-75');
    else cnSearch.push('active');

    const hClasses = ["align-middle", col.name];
    if (headerClasses) hClasses.push(headerClasses);

    const oc = ['ps-2', orderClasses];
    if (!sortDir) oc.push('opacity-50');

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

    return React.createElement('th',
      { className: hClasses.filter(c => !!c).flat().join(' '), scope: "col" },
      React.createElement('div', { className: "d-flex align-items-center" },
        React.createElement('div', { className: cn.filter(c => !!c).flat().join(' '), style },
          React.createElement('span', {}, col.label)
        ),
        React.createElement('div', { className: "d-flex" },
          col.filter && React.createElement('div', { className: "ps-2 mt-1 drop" + filterPos },
            React.createElement(DropdownContainer,
              {
                name: col.name + 'DropdownFilter',
                label: React.createElement(Icons,
                  { icon: icons.search, className: cnSearch.filter(c => !!c).flat().join(' ') }
                ),
                dropdownClasses: "dropdown-menu-end p-0",
                dropdownClass: false
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
            )
          )
        ),
        showOrder && React.createElement('div',
          { className: oc.flat().filter(c => !!c).join(' '), style: { fontSize: 10 } },
          React.createElement('span',
            { onClick: (e) => this.sort('ASC', e) },
            React.createElement(Icons, {
              icon: icons.caretUp,
              className: odescc.flat().filter(c => !!c).join(' ')
            })
          ),
          React.createElement('span',
            { onClick: (e) => this.sort('DESC', e) },
            React.createElement(Icons, {
              icon: icons.caretDown,
              className: oascc.flat().filter(c => !!c).join(' ')
            })
          )
        )
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
    colClasses: PropTypes.any,
    columns: PropTypes.any,
    data: PropTypes.any,
    headerClasses: PropTypes.any,
    hover: PropTypes.any,
    icons: PropTypes.any,
    mapCells: PropTypes.any,
    mapRows: PropTypes.any,
    mutations: PropTypes.any,
    onChange: PropTypes.any,
    orderable: PropTypes.any,
    striped: PropTypes.any,
    tableClasses: PropTypes.any,
    vertical: PropTypes.bool,
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
      icons, orderable, name,
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
      orderActiveClasses
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
      className: cnRow.filter(c => !!c).flat().join(' ')
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
    const cellAttrs = {
      className: ['cell', col.type, col.name + '-cell', col.classes, colClasses],
      style: vertical
        ? {
          minWidth: col.width,
          ...col.style
        }
        : col.style,
      title: rowData[colName] !== undefined ? rowData[colName].toString() : null
    }

    const mutation = typeof mapCellsFunc === 'function' && mapCellsFunc(name, col.name, rowData, { cellAttrs, fullColumn: col }) || {};
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
    cellAttrs.className = cellAttrs.className.filter(c => !!c).flat().join(' ');

    const formater = FORMATS[col.format] || (raw => t(raw, col.context));
    const cellData = typeof rowData[col.name] !== 'undefined' ? rowData[col.name] : true;

    const cell = React.createElement('div',
      { ...cellAttrs },
      formater(cellData, formatOptions, rowData, this.jsonRender, colName));
    return (colName === 'id'
      ? React.createElement('th',
        { key: i + '-' + colName, className: colName, scope: "row" },
        cell
      )
      : React.createElement('td',
        {
          key: i + '-' + colName,
          className: vertical ? [colName, 'row-' + (i - 1)].filter(c => !!c).flat().join(' ') : colName
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
    const { data, columns, tableClasses, hover, striped, vertical, disabled } = this.props;

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
    data.forEach((row, i) => {
      Object.entries(columns).forEach(([key, col], j) => {
        const column = col.name ? col : { name: key, ...col };

        if (!vertical) {
          // Si la tabla no es vertical (es decir, es horizontal)

          // Si no se ha inicializado el registro de la tabla (fila) en la posición i, se inicializa
          if (!tableData[i]) tableData[i] = { cells: [], data: row };

          // Se mapea la celda en la posición j de la fila i, pasándole los datos de la fila y la columna
          tableData[i].cells[j] = this.mapCell(row, column, j);
        } else {
          // Si la tabla es vertical

          // Si no se ha inicializado el registro de la tabla (columna) en la posición j, se inicializa
          if (!tableData[j]) tableData[j] = { cells: [], data: column };

          // Para la primera fila de cada columna (i === 0), se mapea la celda de encabezado
          if (i === 0) tableData[j].cells[0] = this.mapHeaderCell([key, column], 0);

          // Para las filas restantes de cada columna, se mapea la celda correspondiente
          const k = i + 1;
          tableData[j].cells[k] = this.mapCell(row, column, k);
        }

      });
    });

    // Renderización de la tabla con las estructuras de encabezado, cuerpo y pie de página
    return (
      React.createElement('table', { className: cn.filter(c => !!c).flat().join(' ') },
        React.createElement('thead', {},
          header && (
            React.createElement('tr', {},
              React.createElement('td', { colSpan: "1000" },
                React.createElement('div', {}, header)
              )
            )
          ),
          !vertical && (
            React.createElement('tr', {},
              Object.entries(columns).map(this.mapHeaderCell)
            )
          )
        ),
        React.createElement('tbody', {},
          tableData.map(({ cells, data }, i) =>
            React.createElement('tr', { ...this.rowProps(data, i) }, cells)
          )
        ),
        footer && (
          React.createElement('tfoot', {},
            React.createElement('tr', {},
              React.createElement('td', { colSpan: "1000" },
                React.createElement('div', {}, footer)
              )
            )
          )
        )
      )
    );
  }

}