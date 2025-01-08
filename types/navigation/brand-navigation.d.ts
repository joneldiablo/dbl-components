export default class BrandNavigation extends Navigation {
    static defaultProps: {
        path: string;
        logoWidth: number;
        logoHeight: string;
        exact: boolean;
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
        classes: string;
        style: {};
        active: boolean;
    };
}
import Navigation from "./navigation";
