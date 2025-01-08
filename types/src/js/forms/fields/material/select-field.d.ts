export default class SelectField extends Field {
    static propTypes: {
        ValueTemplate: any;
        disabled: any;
        fullWidth: any;
        info: any;
        label: any;
        name: any;
        options: any;
        placeholder: any;
        required: any;
        variant: any;
    };
    static defaultProps: {
        options: never[];
        ValueTemplate: ({ children }: {
            children: any;
        }) => any;
        type: string;
        style: {
            fontSize: number;
        };
        variant: string;
        fullWidth: boolean;
    };
}
import Field from "./field";
