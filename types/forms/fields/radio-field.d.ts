export default class RadioField extends Field {
    static defaultProps: {
        inline: boolean;
        labelInline: boolean;
        type: string;
        default: string;
        value: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    jsonRender: JsonRender;
    get type(): string;
    nodeOption: (itemRaw: any, i: any) => any;
}
import Field from "./field";
import JsonRender from "../../json-render";
