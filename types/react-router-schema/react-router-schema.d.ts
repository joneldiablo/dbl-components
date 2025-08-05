export default class SchemaController {
    static jsClass: string;
    static propTypes: {
        test: any;
        theme: any;
        routes: any;
        defaultController: any;
        forceRebuild: any;
    };
    static defaultProps: {
        routes: never[];
        defaultController: typeof import("..").Controller;
    };
    constructor(props: any);
    routeNodes: any[];
    state: {};
    routesHash: string;
    buildRoutes(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    /** views
     * Método recursivo que procesa el schema de rutas
     * usar en el mapeo de un arreglo ej. routes.map(this.views)
     * permite que el schema tenga un arreglo de paths
     **/
    views: (route: any, i: any, depth?: number) => any;
    render(): any;
}
export function BrowserRouterSchema(incomingProps: any): any;
export namespace BrowserRouterSchema {
    export { schemaPropTypes as propTypes };
}
export function HashRouterSchema(incomingProps: any): any;
export namespace HashRouterSchema {
    export { schemaPropTypes as propTypes };
}
declare namespace schemaPropTypes {
    export let test: any;
    export let theme: any;
    import routes = routePropTypes.routes;
    export { routes };
    export let defaultController: any;
    export let forceRebuild: any;
}
declare namespace routePropTypes {
    export let path: any;
    export let content: any;
    export let name: any;
    export let component: any;
    export let exact: any;
    export let strict: any;
    export let location: any;
    export let sensitive: any;
    let routes_1: any;
    export { routes_1 as routes };
}
export {};
