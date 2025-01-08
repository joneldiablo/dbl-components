export default class Form extends Component {
    static propTypes: {
        label: any;
        labelClasses: any;
        fieldClasses: any;
        fields: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        fieldClasses: string;
        fields: never[];
        classes: string;
        style: {};
        active: boolean;
    };
    unique: string;
    fieldNames: any;
    allFields: {};
    form: import("react").RefObject<any>;
    mapFields(field: any, i: any): any;
    onChange(fieldData: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    reset(dontDispatch: any): void;
    onUpdate: ({ data, loading, reset }: {
        data: any;
        loading: any;
        reset: any;
    }) => void;
    onInvalid: () => void;
    timeoutInvalid: number | undefined;
    onInvalidField: (invalidData: any) => void;
    onSubmit: (e: any) => Promise<void>;
    toggleSubmit(enabled: any): void;
}
import Component from "../component";
