export default class ActionComponent extends Component {
    static propTypes: {
        classButton: any;
        close: any;
        disabled: any;
        form: any;
        icon: any;
        iconClasses: any;
        iconProps: any;
        id: any;
        open: any;
        status: any;
        statusClasses: any;
        statusIcons: any;
        to: any;
        type: any;
        value: any;
        justifyContent: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        type: string;
        classButton: boolean;
        open: boolean;
        close: boolean;
        statusIcons: {
            success: string;
            error: string;
            warning: string;
            loading: string;
        };
        statusClasses: {
            success: string;
            error: string;
            warning: string;
            loading: string;
        };
        iconClasses: string;
        iconProps: {};
        justifyContent: string;
        classes: string;
        style: {};
        active: boolean;
    };
    static schemaContent: {
        actionIcon: {
            name: string[];
            component: string;
            icon: string;
            style: {
                width: string;
            };
        };
        actionContent: {
            name: string[];
            tag: string;
        };
        actionStatus: {
            name: string[];
            component: string;
            icon: string;
            classes: string;
        };
    };
    onClick(e: any): void;
    schema: any;
    jsonRender: JsonRender;
    content(): any;
    mutations(name: any, config: any): any;
}
import Component from "../component";
import JsonRender from "../json-render";
