/**
 * @param {Object} props - Propiedades de la aplicación
 * @param {Object} props.icons - Archivo IcoMoon que registra todos los íconos
 * @param {Object} props.controllers - listado de los controladores personalizados
 * @param {Object} props.components - listado de componentes personalizados
 * @param {Array|Object} props.definitions - global definitions
 * @param {Object[]} props.routes - array of routes
 * @param {Object} props.schema - initial schema, the app root
*/
export class AppController {
    constructor(props?: boolean);
    fetchList: {};
    globalDefinitions: any[];
    routes: {};
    tmpRoutesFound: number;
    rootSchema: any;
    random: string;
    props: any;
    prefixStorage: string;
    init(props?: {}): void;
    findingRoutesRecursive(schema: any): any;
    buildRootSchema(schema: any): any;
    stringify(data: any, encrypt: any): string;
    parse(data: any): any;
    set(key: any, data: any, { dispatch, storage, encrypt }?: {
        dispatch?: boolean | undefined;
        storage?: string | undefined;
        encrypt?: boolean | undefined;
    }): void;
    get(key: any): any;
    remove(key: any, { storage, dispatch }?: {
        dispatch?: boolean | undefined;
    }): void;
    getRootDefinitions(): any;
    getViewDefinitions(name: any): any;
    getGlobalDefinitions(): any[];
    getGlobalKeys(): string[];
    minTimeout(promise: any, timeout?: any): Promise<any>;
    addHeaders(obj: any): void;
    removeHeaders(...headerName: any[]): void;
    fetch(url: any, options?: {
        method: string;
    }): Promise<any>;
    onTimeout(controller: any): void;
    getLang(): string;
    setLang: (lang: any) => void;
    setUpdate(update: any): void;
    update: any;
}
declare const _default: AppController;
export default _default;
