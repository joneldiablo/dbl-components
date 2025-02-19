export default class Field {
    static propTypes: {
        disabled: any;
        fullWidth: any;
        info: any;
        label: any;
        name: any;
        placeholder: any;
        required: any;
        variant: any;
    };
    static defaultProps: {
        type: string;
        style: {
            fontSize: number;
        };
        variant: string;
        fullWidth: boolean;
    };
    constructor(props: any);
    state: {
        value: any;
        errorMessage: null;
        error: boolean;
    };
    onChange(e: any): void;
    get type(): any;
    nodeInfo(info: any): any;
    render(): any;
    ref: any;
}
