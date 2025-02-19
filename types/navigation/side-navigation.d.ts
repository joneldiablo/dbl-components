export default class SideNavigation {
    static propTypes: {
        className: any;
        iconSize: any;
        menu: any;
        style: any;
    };
    static jsClass: string;
    static defaultProps: {
        className: string;
        style: {};
        menu: never[];
        iconSize: number;
    };
    state: {
        stick: boolean;
        icon: string;
    };
    stick: (e: any) => void;
    render(): any;
}
