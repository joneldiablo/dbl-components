export default class JsonRenderComponent extends Component {
    static template: {
        view: {};
        definitions: {};
    };
    static propTypes: {
        view: any;
        childrenIn: any;
        definitions: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        view: null;
        childrenIn: boolean;
        definitions: {};
        classes: string;
        style: {};
        active: boolean;
    };
    events: any[];
    jsonRender: JsonRender;
    get fixedProps(): any;
    get childrenIn(): boolean;
    get theView(): any;
    componentDidMount(): void;
    evalTemplate(): void;
    templateSolved: any;
    componentWillUnmount(): void;
    mutations(sectionName: any, section: any): any;
}
import Component from "./component";
import JsonRender from "./json-render";
