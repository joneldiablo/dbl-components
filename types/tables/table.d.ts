export namespace FORMATS {
    function component(raw: any, rawprops: any, data: Object, jsonRender: Object, colName: string): React.Component;
    function date(raw: any, params?: {}): string;
    function datetime(raw: any, params?: {}): string;
    function time(raw: any, params?: {}): any;
    function currency(raw: any, params?: {}): string;
    function number(raw: any, params?: {}): string;
    function boolean(raw: any, { "true": True, "false": False }: Object): string;
}
export function addFormatTemplates(newTemplates?: Object): void;
/**
 * Componente de celda de encabezado para una tabla.
 *
 * @class HeaderCell
 * @extends {React.Component}
 */
export class HeaderCell {
    static propTypes: {
        col: any;
        icons: any;
        orderable: any;
        classes: any;
        headerClasses: any;
        orderClasses: any;
        orderActiveClasses: any;
        dropFilters: any;
        headerRefs: any;
        tableName: any;
        vertical: any;
    };
    static jsClass: string;
    static defaultProps: {};
    constructor(props: any);
    state: {
        searchActive: boolean;
    };
    events: any[];
    ref: import("react").RefObject<any>;
    /**
     * Método de ciclo de vida de React que se llama cuando el componente se ha montado.
     * Se suscribe a eventos relevantes para este componente.
     */
    componentDidMount(): void;
    /**
     * Método de ciclo de vida de React que se llama cuando el componente se actualiza.
     * Restablece la dirección de la clasificación si la clasificación se ha eliminado.
     * @param {Object} prevProps - Las propiedades anteriores del componente.
     * @param {Object} prevState - El estado anterior del componente.
     */
    componentDidUpdate(prevProps: Object, prevState: Object): void;
    /**
     * Método de ciclo de vida de React que se llama cuando el componente está a punto de desmontarse.
     * Cancela la suscripción a todos los eventos a los que se suscribió en componentDidMount.
     */
    componentWillUnmount(): void;
    /**
     * Manejador de eventos para cambios en el filtro.
     * @param {Object} data - Los datos del evento.
     */
    onChangeFilter: (data: Object) => void;
    onUpdateFilter({ value, reset }: {
        value: any;
        reset: any;
    }): void;
    /**
     * Realiza la acción de ordenar las celdas en el encabezado.
     * @param {string} dir - La dirección en la que se va a realizar la ordenación.
     */
    sort(dir: string): void;
    /**
     * Renderiza el componente.
     * @returns {React.Component} El componente renderizado.
     */
    render(): React.Component;
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
    static slots: string[];
    static propTypes: {
        colClasses: any;
        headerClasses: any;
        tableClasses: any;
        orderClasses: any;
        orderActiveClasses: any;
        columns: any;
        data: any;
        hover: any;
        icons: any;
        mapCells: any;
        mapRows: any;
        mutations: any;
        onChange: any;
        orderable: any;
        striped: any;
        vertical: any;
        headerCustom: any;
        columnsCustom: any;
        footerCustom: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        data: never[];
        striped: boolean;
        hover: boolean;
        icons: {
            caretUp: string;
            caretDown: string;
            search: string;
            clear: string;
        };
        vertical: boolean;
        orderClasses: string;
        orderActiveClasses: string;
        thead: {};
        tbody: {};
        classes: string;
        style: {};
        active: boolean;
    };
    jsonRender: JsonRender;
    /**
     * Subscribes to the events when the component is mounted.
     *
     * @method componentDidMount
     * @memberof Table
     */
    componentDidMount(): void;
    events: any[] | undefined;
    /**
     * Unsubscribes from the events when the component is unmounted.
     *
     * @method componentWillUnmount
     * @memberof Table
     */
    componentWillUnmount(): void;
    /**
     * Handles sorting event.
     *
     * @method onSort
     * @param {Object} orderBy - An object representing the column to be sorted.
     * @memberof Table
     */
    onSort: (orderBy: Object) => void;
    /**
     * Handles cell events.
     *
     * @method onEventCell
     * @param {Object} dataRaw - Raw data of the event.
     * @memberof Table
     */
    onEventCell: (dataRaw: Object) => void;
    /**
     * Maps HeaderCell components for each column.
     *
     * @method mapHeaderCell
     * @param {Array} args - The column properties.
     * @param {number} i - The index of the column.
     * @returns {React.Component} - A HeaderCell component.
     * @memberof Table
     */
    mapHeaderCell: ([key, col]: any[], i: number) => React.Component;
    /**
     * Provides properties for a row.
     *
     * @method rowProps
     * @param {Object} rowOrColumn - The data of the row or column.
     * @param {number} i - The index of the row or column.
     * @returns {Object} - Properties for the row.
     * @memberof Table
     */
    rowProps: (rowOrColumn: Object, i: number) => Object;
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
    mapCell: (rowData: Object, col: Object, i: number) => React.Component;
    /**
     * Renders the table content.
     *
     * @method content
     * @param {Array} children - Optional children to be rendered in the table.
     * @returns {React.Component} - The rendered table.
     * @memberof Table
     */
    content(children?: any[]): React.Component;
}
export type FormatOptions = {
    /**
     * - Formato para fechas y horas.
     */
    format?: string | undefined;
    /**
     * - Si se debe considerar la zona horaria local.
     */
    locale?: boolean | undefined;
    /**
     * - Código de moneda para el formato de moneda.
     */
    currency?: string | undefined;
    /**
     * 'true'] - Representación en cadena de un valor booleano `true`.
     */
    ""?: string | undefined;
};
import Component from "../component";
import JsonRender from "../json-render";
