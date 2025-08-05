export default class HeaderNavigation {
    static propTypes: {
        className: any;
        classes: any;
        icon: any;
        img: any;
        label: any;
        menu: any;
        style: any;
        svg: any;
    };
    static jsClass: string;
    constructor(props: any);
    dropdowns: any[];
    componentWillUnmount(): void;
    dropdownInit: (ref: any) => void;
    menuItem: ([i, item]: [any, any]) => any;
    render(): any;
}
