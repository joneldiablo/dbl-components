export function addExclusions(exclusion: any): void;
/**
 * Clase utilizada para generar contenido dinámico en React a partir de una estructura de datos JSON.
 *
 * @class JsonRender
 */
export default class JsonRender {
    /**
     * Crea una instancia de JsonRender.
     * @param {Object} props - Las propiedades del componente.
     * @param {Object} mutations - Las mutaciones para las secciones.
     */
    constructor(props: Object, mutations: Object);
    /**
     * Opciones para el análisis del contenido HTML.
     * @type {Object}
     */
    parseOpts: Object;
    actualSections: any[];
    props: Object;
    mutations: Object;
    /**
     * Construye una sección basada en la información proporcionada.
     * @param {Object} sectionRaw - Los datos de la sección.
     * @param {number} i - El índice de la sección.
     * @returns {React.Component|boolean} - El componente de la sección construido.
     */
    sections(sr: any, i: number): React.Component | boolean;
    /**
     * Construye el contenido basado en la estructura de datos proporcionada.
     * @param {any} content - El contenido a construir.
     * @param {number} index - El índice del contenido.
     * @returns {React.Component|React.Fragment|boolean} - El componente construido.
     */
    buildContent(content: any, index: number): React.Component | React.Fragment | boolean;
}
