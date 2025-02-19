export class DropdownItem extends Component {
    static propTypes: any;
    static defaultProps: {
        badgeClasses: string;
        classes: string;
        style: {};
        active: boolean;
    };
    tag: any;
    eventHandlers: {
        onClick: (e: any) => void;
    };
    onClick: (e: any) => void;
}
export default class DropdownButtonContainer extends Component {
    static propTypes: {
        allowClose: any;
        btnClasses: any;
        disabled: any;
        dropdown: any;
        dropdownClass: any;
        dropdownClasses: any;
        itemClasses: any;
        label: any;
        menu: any;
        mutations: any;
        value: any;
        zIndex: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        itemClasses: string;
        dropdownClasses: string;
        dropdownClass: boolean;
        btnClasses: string;
        dropdown: {};
        zIndex: number;
        classes: string;
        style: {};
        active: boolean;
    };
    btn: import("react").RefObject<any>;
    trigger: string;
    onBsEvents(evt: any): void;
    events: (string | (({ open }: {
        open: any;
    }) => void))[][];
    jsonRender: JsonRender;
    componentDidMount(): void;
    componentWillUnmount(): void;
    bsDropdown: any;
    refBtn(ref: any): void;
    onUpdate({ open }: {
        open: any;
    }): void;
    onToggleDrop(evt: any): void;
    dropdownRender(children: any): any;
}
import Component from "../component";
import JsonRender from "../json-render";
