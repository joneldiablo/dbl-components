export default class FileField extends Field {
    static defaultProps: {
        multiple: boolean;
        format: string;
        zip: boolean;
        type: string;
        default: string;
        value: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    onDragEnter(e: any): void;
    onDragLeave(e: any): void;
    onDrop(e: any): void;
    onDragOver(e: any): void;
    jsonRender: JsonRender | undefined;
    get type(): string;
    onChange(e: any): Promise<void>;
    readAs(file: any, format?: string): any;
}
import Field from "./field";
import JsonRender from "../../json-render";
