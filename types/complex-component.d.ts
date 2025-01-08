export function nameSuffixes(sfxs?: any[]): any;
export default class ComplexComponent extends Component {
    static defaultProps: {
        schema: {
            view: {
                name: string;
                content: string;
            };
            definitions: {};
        };
        definitions: {};
        classes: {
            '.': string;
        };
        rules: {};
        style: {};
        active: boolean;
    };
    events: any[];
    jsonRender: JsonRender;
    componentDidMount(): void;
    componentWillUnmount(): void;
    buildView(): any;
    mutations(sn: any): any;
}
import Component from "./component";
import JsonRender from "./json-render";
