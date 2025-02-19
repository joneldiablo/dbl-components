export default class FullscreenContainer {
    static propTypes: {
        children: any;
        className: any;
        gutter: any;
        overflow: any;
        style: any;
    };
    static jsClass: string;
    static defaultProps: {
        className: string;
        gutter: null;
        overflow: string;
        style: {};
    };
    render(): any;
}
