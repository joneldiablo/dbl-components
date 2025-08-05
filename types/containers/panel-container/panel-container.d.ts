export default class PanelContainer extends Component {
    static propTypes: {
        breakpoint: any;
        contentTop: any;
        icon: any;
        iconSize: any;
        link: any;
        logo: any;
        type: any;
        width: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        schema: any;
        definitions: {};
        breakpoint: number;
        iconSize: number;
        type: string;
        width: number;
        menu: never[];
        classes: {
            '.': string;
            items: string;
        };
        rules: any;
        style: {};
        active: boolean;
    };
    events: (string | ((update: any, dispatch: any) => void))[][];
    eventHandlers: {
        onMouseEnter: (e: any) => void;
        onMouseLeave: (e: any) => void;
        onTouchStart: (e: any) => void;
        onTouchEnd: (e: any) => void;
    };
    timeoutResize: number | undefined;
    onWindowResize: (e: any) => void;
    onChangeLocation: () => void;
    onToggleFixed: (e: any) => void;
    onMouseEnter: (e: any) => void;
    onMouseLeave: (e: any) => void;
    onTouchStart: (e: any) => void;
    touchstartX: any;
    onTouchEnd: (e: any) => void;
    touchendX: any;
    onUpdate: (update: any, dispatch: any) => void;
    mutations(sn: any, s: any): any;
}
import Component from "../../complex-component";
