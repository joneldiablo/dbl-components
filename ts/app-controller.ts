import urlJoin from "url-join";

import {
  flatten,
  randomS4,
  resolveRefs,
  deepMerge,
  eventHandler,
  addDictionary,
  addFormatDate,
  addFormatNumber,
  addFormatTime,
  getLang,
  setLang,
  addFormatDateTime,
} from "dbl-utils";

import { addIcons } from "./media/icons";
import { addComponents } from "./components";
import { addControllers } from "./controllers";
import { addFields } from "./forms/fields";

const parseHeaders = (headers?: Record<string, string> | string): Record<string, string> => {
  if (!headers) return {};
  if (typeof headers === "string") {
    return headers.split("|").reduce<Record<string, string>>((rdx, chunk) => {
      const [headerKey, ...value] = chunk.split(":").map((s) => s.trim());
      if (headerKey) rdx[headerKey] = value.join(":");
      return rdx;
    }, {});
  }
  return { ...headers };
};

type Dictionary = Record<string, unknown>;

interface FetchEnhancers {
  fetchBefore?: (
    url: string,
    options: RequestInit & { query?: Record<string, unknown>; format?: "json" | "raw" | keyof Body & string }
  ) => RequestInit & {
    query?: Record<string, unknown>;
    format?: "json" | "raw" | keyof Body & string;
  };
  fetchAfter?: <T>(response: T) => T | Promise<T>;
  fetchError?: (error: any, url: string) => any;
}

export interface AppControllerProps extends FetchEnhancers {
  definitions?: Dictionary | Dictionary[];
  routes?: Array<Record<string, any>>;
  fields?: Record<string, any>;
  components?: Record<string, any>;
  controllers?: Record<string, any>;
  icons?: unknown;
  schema?: Record<string, any>;
  api?: string;
  apiHeaders?: Record<string, string> | string;
  maxTimeout?: number;
  minTimeout?: number;
  dictionary?: Dictionary;
  formatDate?: Dictionary;
  formatNumber?: Dictionary;
  formatTime?: Dictionary;
  formatDateTime?: Dictionary;
  lang?: string;
  initialState?: Record<string, any>;
}

interface FetchController extends AbortController {
  timeoutId?: ReturnType<typeof setTimeout>;
  timeout?: boolean;
}

const GLOBAL_STATE: Record<string, any> = {};

export class AppController {
  eventHandler = eventHandler;
  fetchList: Record<string, FetchController> = {};
  globalDefinitions: Dictionary[] = [];
  routes: Record<string, any> = {};
  tmpRoutesFound = 0;
  rootSchema: any;
  random = randomS4();
  props: any;
  prefixStorage = "_gs.";
  update?: (value: string) => void;

  constructor(props: AppControllerProps = {}) {
    this.props = {
      definitions: [],
      routes: [],
      fields: {},
      components: {},
      controllers: {},
      icons: undefined,
      schema: {
        view: {
          name: "appEmpty",
          path: "/",
          content: "Root empty site",
        },
      },
      api: "http://localhost:3000/",
      apiHeaders: {},
      fetchBefore: (url, options) => ({ ...options }),
      fetchAfter: (res) => res,
      fetchError: (error) => error,
      maxTimeout: 0,
      minTimeout: 1000,
      dictionary: {},
      formatDate: {},
      formatNumber: {},
      formatTime: {},
      formatDateTime: {},
      lang: "default",
      initialState: {},
      ...props,
      apiHeaders: parseHeaders(props.apiHeaders),
    };

    if (Object.keys(props).length) {
      this.init(props);
    }
  }

  init(props: AppControllerProps = {}): void {
    const mergedProps = {
      ...this.props,
      ...props,
    } as any;
    mergedProps.apiHeaders = parseHeaders(props.apiHeaders ?? this.props.apiHeaders);
    this.props = mergedProps;
    const {
      definitions,
      routes,
      fields,
      components,
      controllers,
      icons,
      schema,
      dictionary,
      formatDate,
      formatNumber,
      formatTime,
      formatDateTime,
      lang,
      initialState,
    } = mergedProps;

    if (icons) addIcons(icons);

    const normalizedDefinitions = Array.isArray(definitions) ? definitions : [definitions];
    this.globalDefinitions.push(...normalizedDefinitions);

    this.routes = (routes || []).reduce<Record<string, any>>((rdx, route: any) => {
      if (route?.view?.name && rdx[route.view.name]) {
        console.warn(`Route was ${route.view.name} overwrited`);
      }
      if (route?.view?.name) rdx[route.view.name] = route;
      return rdx;
    }, {});

    if (fields) addFields(fields);
    if (components) addComponents(components);
    if (controllers) addControllers(controllers);
    if (dictionary) addDictionary(dictionary);
    if (formatDate) addFormatDate(formatDate);
    if (formatNumber) addFormatNumber(formatNumber);
    if (formatTime) addFormatTime(formatTime);
    if (formatDateTime) addFormatDateTime(formatDateTime);
    if (lang) setLang(lang);

    if (initialState) {
      const session = typeof window !== "undefined" ? window.sessionStorage : undefined;
      const local = typeof window !== "undefined" ? window.localStorage : undefined;
      const keys = [
        ...(session ? Object.keys(session) : []),
        ...(local ? Object.keys(local) : []),
      ]
        .filter((k) => k.startsWith(this.prefixStorage))
        .map((k) => k.replace(this.prefixStorage, ""));

      Object.entries(initialState).forEach(([key, value]) => {
        if (keys.includes(key)) this.get(key);
        else GLOBAL_STATE[key] = value;
      });
    }

    const schemaWithDefaults = schema || {
      view: {
        name: "appEmpty",
        path: "/",
        content: "Root empty site",
      },
    };
    schemaWithDefaults.path = schemaWithDefaults.path || "/";
    this.rootSchema = this.buildRootSchema(schemaWithDefaults);
    console.info("Total Routes:", this.tmpRoutesFound);
  }

  private findingRoutesRecursive(schema: any): any {
    this.tmpRoutesFound++;
    const newDefs = deepMerge({}, ...this.globalDefinitions, schema.definitions || {});
    const view = resolveRefs(schema.view, { definitions: newDefs, data: schema.data || {} });
    if (schema.routes?.length) {
      view.routes = Object.entries(resolveRefs(schema.routes, { routes: this.routes })).map(
        ([key, route]) => {
          if (!(route && (route as any).view)) {
            console.error("ROUTE VIEW (route.view) NOT FOUND", route);
            return {
              name: `${view.name}.${key}`,
              path: `/${view.name}-${key}`,
              tag: "error",
              content: `
        <p class='text-danger'>NOT FOUND</p>
        <p class='bg-dark text-light'><pre>${JSON.stringify(schema, null, 2)}}</pre></p>
        `,
            };
          }
          return this.findingRoutesRecursive(route);
        }
      );
    }
    return view;
  }

  private buildRootSchema(schema: any): any {
    this.tmpRoutesFound = 0;
    const root = this.findingRoutesRecursive(schema);
    console.info("Total Routes:", this.tmpRoutesFound);
    return root;
  }

  private stringify(data: any, _encrypt?: boolean): string {
    return JSON.stringify(data);
  }

  private parse(data: string): any {
    return JSON.parse(data);
  }

  set(
    key: string,
    data: any,
    { dispatch = true, storage = "local", encrypt = false }: { dispatch?: boolean; storage?: "local" | "session" | "none"; encrypt?: boolean } = {}
  ): void {
    const payload = this.stringify(data, encrypt);
    const session = typeof window !== "undefined" ? window.sessionStorage : undefined;
    const local = typeof window !== "undefined" ? window.localStorage : undefined;
    if (storage === "local") local?.setItem(this.prefixStorage + key, payload);
    else if (storage === "session") session?.setItem(this.prefixStorage + key, payload);
    GLOBAL_STATE[key] = data;
    if (dispatch) eventHandler.dispatch("global." + key, data);
  }

  get<T = any>(key: string): T | undefined {
    if (GLOBAL_STATE[key] === undefined) {
      const session = typeof window !== "undefined" ? window.sessionStorage : undefined;
      const local = typeof window !== "undefined" ? window.localStorage : undefined;
      let value = session?.getItem(this.prefixStorage + key) ?? null;
      if (value === null) {
        value = local?.getItem(this.prefixStorage + key) ?? null;
      }
      if (value !== null && value !== undefined) GLOBAL_STATE[key] = this.parse(value);
    }
    return GLOBAL_STATE[key] as T | undefined;
  }

  remove(key: string, { storage, dispatch = true }: { storage?: "local" | "session"; dispatch?: boolean } = {}): void {
    const session = typeof window !== "undefined" ? window.sessionStorage : undefined;
    const local = typeof window !== "undefined" ? window.localStorage : undefined;
    if (storage === "local") local?.removeItem(this.prefixStorage + key);
    else if (storage === "session") session?.removeItem(this.prefixStorage + key);
    else {
      local?.removeItem(this.prefixStorage + key);
      session?.removeItem(this.prefixStorage + key);
    }
    GLOBAL_STATE[key] = null;
    delete GLOBAL_STATE[key];
    if (dispatch) eventHandler.dispatch("global." + key);
  }

  getRootDefinitions(): any {
    const allDefs = deepMerge({}, ...this.globalDefinitions, this.rootSchema?.definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  getViewDefinitions(name: string): any {
    if (!this.routes[name]?.definitions) return {};
    const allDefs = deepMerge({}, ...this.globalDefinitions, this.routes[name].definitions || {});
    return resolveRefs(allDefs, { definitions: allDefs });
  }

  getGlobalDefinitions(): Dictionary[] {
    return this.globalDefinitions;
  }

  getGlobalKeys(): string[] {
    return Object.keys(GLOBAL_STATE);
  }

  async minTimeout<T>(promise: Promise<T>, timeout = this.props.minTimeout): Promise<T> {
    const [result] = await Promise.all([
      promise,
      new Promise((resolve) => setTimeout(resolve, timeout, true)),
    ]);
    return result;
  }

  addHeaders(obj: Record<string, string>): void {
    Object.assign(this.props.apiHeaders, obj);
  }

  removeHeaders(...headerName: string[]): void {
    headerName
      .flat()
      .filter(Boolean)
      .forEach((hn) => {
        delete (this.props.apiHeaders as Record<string, string>)[hn];
      });
  }

  async fetch(url: string, options: RequestInit & { query?: Record<string, unknown>; format?: "json" | "raw" } = { method: "GET" }): Promise<any> {
    const method = options.method ?? "GET";
    const key = method + url;
    if (this.fetchList[key]) {
      this.fetchList[key].abort();
    }

    const before = this.props.fetchBefore?.(url, { ...options }) ?? options;
    const { query, format = "json", timeout = this.props.maxTimeout, body, headers, ...conf } = before as any;
    if (body) (conf as RequestInit).body = JSON.stringify(body);

    const fUrl = urlJoin(this.props.api, url);
    const urlFinal = new URL(fUrl);
    const flattenQuery = flatten(query || {}, { safe: true });
    Object.entries(flattenQuery).forEach(([keyQuery, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => urlFinal.searchParams.append(keyQuery, v as any));
      } else if (["number", "boolean", "string"].includes(typeof value)) {
        urlFinal.searchParams.set(keyQuery, value as any);
      }
    });

    const controller: FetchController | undefined = timeout
      ? new AbortController()
      : undefined;

    if (controller) {
      controller.timeoutId = setTimeout(() => this.onTimeout(controller), timeout);
      this.fetchList[key] = controller;
      (conf as RequestInit).signal = controller.signal;
    }

    const apiHeaders = parseHeaders(this.props.apiHeaders);

    (conf as RequestInit).headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...apiHeaders,
      ...headers,
    };

    const fetchPromise = fetch(urlFinal, conf as RequestInit)
      .then(async (r) => {
        if (!r.ok) {
          const error: any = new Error(r.statusText);
          error.status = r.status;
          const payload = await r.json().catch(() => ({}));
          Object.assign(error, payload);
          throw error;
        }
        if (format === "raw") return r;
        const parseMethod = (r as any)[format];
        return typeof parseMethod === "function" ? parseMethod.call(r) : r;
      })
      .catch((error) => {
        if (controller?.timeout) {
          const timeoutError: any = new Error("timeout");
          timeoutError.error = true;
          return this.props.fetchError?.(timeoutError, url);
        }
        error.error = true;
        console.error(error);
        return this.props.fetchError?.(error, url);
      })
      .then((res) => (this.props.fetchAfter ? this.props.fetchAfter(res) : res))
      .finally(() => {
        if (controller?.timeoutId) clearTimeout(controller.timeoutId);
        if (controller && this.fetchList[key] === controller) {
          delete this.fetchList[key];
        }
      });

    return this.minTimeout(fetchPromise as Promise<any>);
  }

  private onTimeout(controller: FetchController): void {
    controller.timeout = true;
    controller.abort();
  }

  getLang(): string {
    return getLang();
  }

  setLang = (lang: string): void => {
    this.props.lang = lang;
    setLang(lang);
    if (typeof this.update === "function") this.update(randomS4());
  };

  setUpdate(update: (value: string) => void): void {
    this.update = update;
  }
}

const appController = new AppController();

export default appController;
