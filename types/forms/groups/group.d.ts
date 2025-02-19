export default class Group extends Component {
    static propTypes: {
        label: any;
        labelClasses: any;
        fieldClasses: any;
        fields: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        fieldClasses: string;
        fields: never[];
        classes: string;
        style: {};
        active: boolean;
    };
    mapFields(field: any, i: any): any;
}
import Component from "../../component";
