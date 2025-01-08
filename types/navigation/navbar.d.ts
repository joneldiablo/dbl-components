export default class Navbar {
    static propTypes: {
        activeClassName: any;
        background: any;
        centeredLogo: any;
        classes: any;
        className: any;
        expand: any;
        logo: any;
        logoHeight: any;
        menu: any;
        menuLeft: any;
        menuPosition: any;
        menuRight: any;
        shadow: any;
        site: any;
        textOverColor: any;
    };
    static jsClass: string;
    static defaultProps: {
        activeClassName: string;
        logo: null;
        background: boolean;
        textOverColor: string;
        logoHeight: number;
        expand: string;
        menuPosition: string;
        shadow: boolean;
        centeredLogo: boolean;
    };
    id: string;
    render(): any;
}
