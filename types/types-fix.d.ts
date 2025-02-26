
declare module 'dbl-components/lib/js/app-controller' {
  interface InitProps {
    definitions?: any[];
    routes?: any[];
    fields?: { [key: string]: any };
    components?: { [key: string]: any };
    controllers?: { [key: string]: any };
    icons?: { [key: string]: any }[] | boolean;
    schema?: {
      view: {
        [key: string]: any;
      };
      definitions?: {
        [key: string]: any;
      }
      routes?: Array<any>;
    };
    api?: string;
    apiHeaders?: { [key: string]: string } | string;
    fetchBefore?: (url: string, options: any) => any;
    fetchAfter?: (res: any) => any;
    fetchError?: (error: any, url: string) => any;
    maxTimeout?: number;
    minTimeout?: number;
    dictionary?: Record<string, any>;
    formatDate?: Record<string, any>;
    formatNumber?: Record<string, any>;
    formatTime?: Record<string, any>;
    formatDateTime?: Record<string, any>;
    lang?: string;
    initialState?: Record<string, any>;
  }
  // Declara la clase
  export class AppController {
    rootSchema: {
      [key: string]: string
    };
    constructor();
    init(props: InitProps): void;
    findingRoutesRecursive(): void;
    buildRootSchema(): void;
    stringify(): void;
    parse(): void;
    set(key: string, data: any): void;
    get(key: string): any;
    remove(): void;
    getRootDefinitions(): void;
    getViewDefinitions(): void;
    getGlobalDefinitions(): void;
    getGlobalKeys(): void;
    minTimeout(): void;
    addHeaders(): void;
    removeHeaders(): void;
    fetch(url: string, options: { [key: string]: any }): Promise<any>;
    onTimeout(): void;
    getLang(): void;
    setLang(): void;
    setUpdate(): void;
  }

  // Exporta la instancia por defecto
  const appController: AppController;
  export default appController;
}

declare module 'dbl-components/lib/js/react-router-schema/react-router-schema' {
  interface ReactRouterSchemaProps {
    routes: {
      [key: string]: any
    };
    test?: boolean;
    forceRebuild?: boolean;
  }
  export const HashRouterSchema: React.FC<ReactRouterSchemaProps>;
  export const BrowserRouterSchema: React.FC<ReactRouterSchemaProps>;
}

declare module 'dbl-components/lib/js/media/svg-imports' {
  interface SvgImportsProps {
    name: string,
    classes: string | string[],
    className: string | string[],
    class: string | string[],
    svg: string,
    style: {
      [key: string]: any
    }
  }
  export const addSvgs: Function;
  type SvgImports = React.FC<SvgImportsProps>;
  export default SvgImports;
}

declare module 'dbl-components/lib/js/media/icons' {
  interface IconsProps {
    name: string,
    classes: string | string[],
    className: string | string[],
    class: string | string[],
    svg: string,
    style: {
      [key: string]: any
    }
  }
  export const addIcons: Function;
  type Icons = React.FC<IconsProps>;
  export default Icons;
}

declare module 'dbl-components/lib/js/component' {
  import * as React from "react";

  export interface ComponentProps extends React.PropsWithChildren {
    name: string,
    classes: string | string[],
    label: React.ReactNode,
    style: {
      [key: string]: any
    },
    _props: object,
  }
  export interface ComponentState extends React.ComponentState {

  }
  export default class Component extends React.Component<ComponentProps> {
    public state: ComponentState;
    public props: ComponentProps;
    constructor(props: ComponentProps);
  }
}

declare module 'dbl-components/lib/js/actions/action' {

  export interface ActionComponent {
    ref: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
  }

}

declare module 'dbl-components/lib/js/controller' {
  import { NavigateFunction } from "react-router";

  import Component, { ComponentProps, ComponentState } from 'dbl-components/lib/js/component';

  export interface ControllerProps extends ComponentProps {
    navigate: NavigateFunction;
  }
  export interface ControllerState extends ComponentState {

  }
  export type DblEvt = {
    [key: string]: any
  };
  type keyEvent = [string, (event: DblEvt) => void | Promise<void>];
  export default class Controller extends Component {
    protected events: Array<keyEvent>;
    public state: ControllerState;
    constructor(props: ControllerProps);
    componentDidMount(): void;
    mutations(name: string, conf: { [key: string]: any }): { [key: string]: any } | void;
  }
}

declare module 'dbl-components/lib/js/containers/hero-container';
declare module 'dbl-components/lib/js/components';

declare module 'dbl-components/lib/js/containers/modal-container' {
  export default class ModalContainer extends Container {

  }
}

declare module 'dbl-components/lib/js/json-render-component' {
  import Component, { ComponentProps } from 'dbl-components/lib/js/component';
  export interface JrcProps extends ComponentProps {
    view: object;
    childrenIn: string | string[];
    definitions: object;
  }
  export default class JsonRenderComponent<T = JrcProps> extends React.Component {
    static defaultProps;
    props: T;
    constructor(props: T);
    mutations(name: string, conf: object): any;
  }
}

declare module 'dbl-components/lib/js/containers/container' {
  import Component from 'dbl-components/lib/js/component';
  export default class Container extends Component {

  }
}

declare module 'dbl-components/lib/js/tables/table' {
  export interface IColumn {

  }
  export interface IPropsTable extends ComponentProps {
    columns: IColumn[] | Record<string, IColumn>;
    headerCustom: any;
  }
}