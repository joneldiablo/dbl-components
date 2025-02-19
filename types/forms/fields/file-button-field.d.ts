export default class FileButtonField extends DropFileField {
    static defaultProps: {
        labelClasses: string;
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
import DropFileField from "./drop-file-field";
