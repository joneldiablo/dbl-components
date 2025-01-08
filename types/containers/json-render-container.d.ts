export default class JsonRenderContainer extends Container {
    static template: {
        view: {};
        definitions: {};
    };
    static propTypes: {
        content: any;
        fluid: any;
        fullWidth: any;
        breakpoints: any;
        xsClasses: any;
        smClasses: any;
        mdClasses: any;
        lgClasses: any;
        xlClasses: any;
        xxlClasses: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        fullWidth: boolean;
        view: null;
        childrenIn: boolean;
        definitions: {};
        fluid: boolean;
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        classes: string;
        style: {};
        active: boolean;
    };
    events: any[];
    jsonRender: JsonRender;
    get fixedProps(): any;
    get childrenIn(): any;
    get theView(): any;
    templateSolved: any;
    mutations(sectionName: any, section: any): any;
}
import Container from "./container";
import JsonRender from "../json-render";
