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
    componentDidUpdate(prevProps: any, prevState: any): void;
    /** views
     * Método recursivo que procesa el schema de rutas
     * usar en el mapeo de un arreglo ej. routes.map(this.views)
     * permite que el schema tenga un arreglo de paths
     **/
    views: (route: any, i: any) => JSX.Element;
    render(): JSX.Element;
}
export function BrowserRouterSchema(props: any): JSX.Element;
export namespace BrowserRouterSchema {
    export { schemaPropTypes as propTypes };
    export { schemaDefaultProps as defaultProps };
}
export function HashRouterSchema(props: any): JSX.Element;
export namespace HashRouterSchema {
    export { schemaPropTypes as propTypes };
    export { schemaDefaultProps as defaultProps };
}
declare namespace schemaPropTypes {
    export let test: any;
    export let theme: any;
    import routes = routePropTypes.routes;
    export { routes };
    export let defaultController: any;
    export let forceRebuild: any;
}
declare namespace schemaDefaultProps {
    let routes_1: never[];
    export { routes_1 as routes };
    let defaultController_1: typeof import("..").Controller;
    export { defaultController_1 as defaultController };
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
    let routes_2: any;
    export { routes_2 as routes };
}
export {};
