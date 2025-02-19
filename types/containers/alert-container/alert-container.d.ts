export default class AlertContainer extends Component {
    static defaultProps: {
        schema: any;
        iconSize: number;
        color: string;
        showClose: boolean;
        definitions: {};
        classes: {
            '.': string;
            label: string;
            icon: string;
            description: string;
            close: string;
        };
        rules: any;
        style: {};
        active: boolean;
    };
    static dontBuildContent: boolean;
    static wrapper: boolean;
    setClasses: any;
    componentDidUpdate(prevProps: any): void;
    buildClasses(prevProps: any): any;
    mutations(sn: any, section: any): any;
}
import Component from "../../complex-component";
