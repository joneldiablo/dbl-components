/**
 * Controller that renders a React Router `<Routes>` tree from a schema.
 *
 * @example
 * ```jsx
 * <BrowserRouterSchema routes={[{ path: '/', component: 'Controller' }]} />
 * ```
 */
export default class SchemaController {
    static jsClass: string;
    static propTypes: {
        test: any;
        theme: any;
        routes: any;
        defaultController: any;
    };
    static defaultProps: {
        routes: never[];
        defaultController: typeof import("..").Controller;
    };
    constructor(props: any);
    routeNodes: any[];
    state: {};
    routesHash: number;
    /**
     * Builds the route elements from the provided schema and updates the hash used
     * to detect changes between renders.
     *
     * @private
     */
    private buildRoutes;
    componentDidUpdate(prevProps: any, prevState: any): void;
    /**
     * Recursively processes a route definition and returns a React Router `<Route>`
     * element. Intended to be used as a callback, for example
     * `routes.map(this.views)`.
     *
     * @param {Object} route - Route definition.
     * @param {number} [i] - Index of the current route.
     * @returns {JSX.Element} The generated `<Route>` element.
     */
    views: (route: Object, i?: number) => JSX.Element;
    render(): any;
}
export function BrowserRouterSchema(incomingProps: Object): JSX.Element;
export namespace BrowserRouterSchema {
    export { schemaPropTypes as propTypes };
}
export function HashRouterSchema(incomingProps: Object): JSX.Element;
export namespace HashRouterSchema {
    export { schemaPropTypes as propTypes };
}
declare namespace schemaPropTypes {
    export let test: any;
    export let theme: any;
    import routes = routePropTypes.routes;
    export { routes };
    export let defaultController: any;
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
