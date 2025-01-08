export default class PaginationField extends Field {
    static propTypes: {
        total: any;
        accept: any;
        autoComplete: any;
        checkValidity: any;
        controlClasses: any;
        default: any;
        disabled: any;
        errorMessage: any;
        first: any;
        floating: any;
        hidden: any;
        inline: any;
        inlineControlClasses: any;
        label: any;
        labelClasses: any;
        max: any;
        message: any;
        messageClasses: any;
        min: any;
        multiple: any;
        noValidate: any;
        pattern: any;
        placeholder: any;
        readOnly: any;
        required: any;
        step: any;
        type: any;
        value: any;
        options: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        total: number;
        default: number;
        firstBtn: boolean;
        previusBtn: boolean;
        nextBtn: boolean;
        lastBtn: boolean;
        texts: {
            first: string;
            previus: string;
            next: string;
            last: string;
            pages: string;
            goto: string;
        };
        type: string;
        value: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    onUpdate({ total, ...data }: {
        [x: string]: any;
        total: any;
    }): void;
    get type(): string;
    isFirst(): boolean;
    isLast(): boolean;
    gotoPage(newPage: any): void;
    returnData(value?: any): void;
    content(): any;
}
import Field from "./field";
