export default class ServiceListNavigation {
    static propTypes: {
        className: any;
        classes: any;
        iconDefault: any;
        iconFrom: any;
        iconSize: any;
        labelFrom: any;
        pathFrom: any;
        style: any;
        url: any;
    };
    static jsClass: string;
    static defaultProps: {
        url: string;
        iconSize: number;
        iconDefault: string;
        iconFrom: string;
        labelFrom: string;
        pathFrom: string;
        className: string;
        style: {};
    };
    constructor(props: any);
    state: {
        menu: never[];
        stick: boolean;
        icon: string;
    };
    stick: (e: any) => void;
    path: any;
    componentWillMount(): void;
    render(): any;
}
