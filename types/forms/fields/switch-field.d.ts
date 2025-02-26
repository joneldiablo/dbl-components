export default class SwitchField extends CheckboxField {
    static defaultProps: {
        format: string;
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
}
import CheckboxField from "./checkbox-field";
