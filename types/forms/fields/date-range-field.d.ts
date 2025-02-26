export default class DateRangeField extends Field {
    static defaultProps: {
        default: string[];
        type: string;
        value: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    inputEnd: import("react").RefObject<any>;
    get type(): string;
    onChange({ target }: {
        target: any;
    }): void;
}
import Field from "./field";
