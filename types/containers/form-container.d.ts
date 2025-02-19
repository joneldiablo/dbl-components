export default class FormContainer extends Component {
    static propTypes: {
        label: any;
        labelClasses: any;
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
        fields: never[];
        classes: string;
        style: {};
        active: boolean;
    };
    unique: string;
    form: import("react").RefObject<any>;
    onChange(fieldData: any): void;
    checkValidity(): void;
    events: (string | (({ data, reset, default: dataDefault, update, clearData, mergeDefault }: {
        data: any;
        reset: any;
        default: any;
        update?: boolean | undefined;
        clearData: any;
        mergeDefault: any;
    }) => void))[][];
    readyEvents: any[];
    componentDidMount(): void;
    componentWillUnmount(): void;
    timeoutOnchage: number | undefined;
    timeoutCheckvalidity: number | undefined;
    onReadyOnce(): void;
    fieldsForEach(func: any): void;
    onUpdate: ({ data, reset, default: dataDefault, update, clearData, mergeDefault }: {
        data: any;
        reset: any;
        default: any;
        update?: boolean | undefined;
        clearData: any;
        mergeDefault: any;
    }) => void;
    mergeDefault: any;
    onDefault: (data: any) => void;
    reset(): void;
    onInvalid: (e: any) => void;
    timeoutInvalid: number | undefined;
    onInvalidField: (invalidData: any) => void;
    onSubmit: (e: any) => Promise<void>;
}
import Component from "../component";
