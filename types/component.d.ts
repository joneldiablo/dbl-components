export default class Component {
    static jsClass: string;
    static propTypes: {
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        classes: string;
        style: {};
        active: boolean;
    };
    constructor(props: any);
    tag: string;
    classes: string;
    style: {};
    name: string;
    state: {
        localClasses: string;
        localStyles: {};
    };
    ref: import("react").RefObject<any>;
    onEvent(e: any): void;
    eventHandlers: {
        onClick: (e: any) => void;
        onChange: (e: any) => void;
        onMouseOver: (e: any) => void;
        onMouseOut: (e: any) => void;
        onKeyDown: (e: any) => void;
        onLoad: (e: any) => void;
    };
    setClasses(classes: any): any[];
    toggleClasses(classes: any): boolean;
    addClasses(classes: any): boolean;
    deleteClasses(classes: any): boolean;
    get componentProps(): any;
    content(children?: any): any;
    render(): any;
    ready: number | undefined;
}
