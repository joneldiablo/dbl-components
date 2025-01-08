export default class JsonEditorField extends Field {
    get inputProps(): {
        id: any;
        name: any;
        value: any;
        className: any;
        ref: import("react").RefObject<any>;
    };
    get inputNode(): import("react").DetailedReactHTMLElement<{}, HTMLElement>;
}
import Field from "./field";
