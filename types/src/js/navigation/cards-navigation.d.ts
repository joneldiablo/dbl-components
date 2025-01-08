export default class CardsNavigation {
    static propTypes: {
        closestId: any;
        menu: any;
    };
    static jsClass: string;
    static defaultProps: {
        menu: never[];
    };
    constructor(props: any);
    state: {
        rowCols: string;
    };
    id: string;
    onResize: ({ target, width }: {
        target: any;
        width: any;
    }) => void;
    componentDidMount(): void;
    render(): any;
}
