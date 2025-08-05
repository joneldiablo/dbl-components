export class ToggleTextNavigation extends Action {
}
export default class Navigation extends Component {
    static defaultProps: {
        menu: never[];
        caretIcons: string[];
        navLink: boolean;
        activeClasses: string;
        inactiveClasses: string;
        pendingClasses: string;
        transitioningClasses: string;
        itemTag: string;
        itemClasses: string;
        floatingClasses: string;
        iconClasses: string;
        classes: string;
        style: {};
        active: boolean;
    };
    events: (string | ((location: any) => void))[][];
    activeElements: {};
    flatItems: {};
    collapses: import("react").RefObject<any>;
    itemsRefs: import("react").RefObject<any>;
    jsonRender: JsonRender;
    hide(e: any): void;
    link(itemRaw: any, i: any, parent: any): any;
    onToggleBtn(): void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    findFirstActive(menu: any, parent: any): undefined;
    onChangeRoute(location: any, action: any): void;
    pathname: any;
    toggleText(open?: boolean): void;
    collapseRef(ref: any, item: any): void;
    onToggleSubmenu(e: any, item: any): void;
    onToggleFloating(e: any, item: any): void;
    setActive(name: any, isActive: any): boolean;
    hasAnActive(menuItem: any): any;
    onChangeLocation(location: any): void;
    activeItem: any;
}
import Action from "../actions/action";
import Component from "../component";
import JsonRender from "../json-render";
