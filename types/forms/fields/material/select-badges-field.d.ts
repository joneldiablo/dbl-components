export default class SelectBadgesField extends Field {
    static propTypes: {
        options: any;
        disabled: any;
        fullWidth: any;
        info: any;
        label: any;
        name: any;
        placeholder: any;
        required: any;
        variant: any;
    };
    static defaultProps: {
        value: never[];
        options: never[];
        type: string;
        style: {
            fontSize: number;
        };
        variant: string;
        fullWidth: boolean;
    };
    remove(item: any): () => void;
    badge: (item: any, i: any) => any;
}
import Field from "./field";
