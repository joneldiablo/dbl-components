export default class AutoResponsiveContainer {
    static propTypes: {
        children: any;
        className: any;
        id: any;
        onResize: any;
        style: any;
    };
    static jsClass: string;
    static defaultProps: {
        id: null;
        className: string;
        style: {};
        onResize: null;
    };
    state: {
        id: any;
    };
    wrapper: any;
    onResize: () => void;
    onResizeTimeout: number | undefined;
    componentDidMount(): void;
    resizeSensor: ResizeSensor | undefined;
    componentWillUnmount(): void;
    render(): any;
}
import ResizeSensor from "css-element-queries/src/ResizeSensor";
