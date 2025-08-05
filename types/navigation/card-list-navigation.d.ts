export default class NavListCards {
    static propTypes: {
        menu: any;
    };
    static jsClass: string;
    static defaultProps: {
        menu: never[];
    };
    constructor(props: any);
    state: {
        type: string;
    };
    componentDidMount(): void;
    getAsCards(): any;
    getAsList(): any;
    render(): any;
}
