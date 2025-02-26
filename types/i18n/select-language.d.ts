export default class SelectLanguage extends SelectField {
    static defaultProps: {
        variant: string;
        value: null;
        ValueTemplate: ({ value, children: label, flag }: {
            value: any;
            children: any;
            flag: any;
        }) => any;
        fullWidth: boolean;
        options: {
            value: string;
            label: string;
        }[];
        type: string;
        default: string;
        first: string;
        floating: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    imTheTrigger: boolean;
    translate: (e: any) => void;
}
import SelectField from "../forms/fields/select-field";
