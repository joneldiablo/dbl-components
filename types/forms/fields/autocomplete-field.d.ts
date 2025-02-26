export default class AutocompleteField extends Field {
    static defaultProps: {
        maxItems: number;
        type: string;
        default: string;
        value: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    menuDropdown: import("react").RefObject<any>;
    onFilter(value?: any): void;
    timeoutFilter: number | undefined;
    onUpdate({ options, more, value, reset, ...update }: {
        [x: string]: any;
        options: any;
        more: any;
        value: any;
        reset: any;
    }): any;
    show: () => void;
    hide: () => void;
    onSelectOption(opt: any): void;
    mapOptions: (optRaw: any, i: any) => any;
    get type(): string;
}
import Field from "./field";
