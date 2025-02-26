export default class FlexContainer {
    static propTypes: {
        children: any;
        className: any;
        colClassNames: any;
        style: any;
    };
    static jsClass: string;
    static defaultProps: {
        className: string;
        style: {};
        colClassNames: never[];
    };
    column: (child: any, i: any) => any;
    render(): any;
}
