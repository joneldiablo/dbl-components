export default class MenuItem extends Component {
    static defaultProps: {
        schema: any;
        exact: boolean;
        activeClassName: string;
        icon: string;
        iconSize: number;
        activeLabel: boolean;
        definitions: {};
        iconInline: boolean;
        classes: {
            '.': string;
            link: string;
            badge: string;
            icon: string;
            label: string;
        };
        rules: any;
        style: {};
        active: boolean;
    };
    mutations(sn: any, s: any): any;
}
import Component from "../../complex-component";
