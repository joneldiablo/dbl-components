export default class RangeField extends Field {
    static defaultProps: {
        type: string;
        default: never[];
        from: {};
        to: {};
        divisor: string;
        controlClasses: never[];
        value: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    events: any[];
    mutations(name: any, section: any): any;
    jsonRender: JsonRender;
    schemaInput: any;
    onUpdate(...args: any[]): void;
    onValuesChange(data: any): void;
    isInvalid(value: any): boolean;
    onAnyInvalid(): void;
    onAnyFocus(): void;
}
import Field from "./field";
import JsonRender from "../../json-render";
