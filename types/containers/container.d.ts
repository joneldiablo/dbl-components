export default class Container extends Component {
    static propTypes: {
        fluid: any;
        fullWidth: any;
        breakpoints: any;
        xsClasses: any;
        smClasses: any;
        mdClasses: any;
        lgClasses: any;
        xlClasses: any;
        xxlClasses: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        fluid: boolean;
        fullWidth: boolean;
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        classes: string;
        style: {};
        active: boolean;
    };
    breakpoint: boolean;
    orientation: boolean;
    waitBreakpoint: any;
    onResize(firstTime: any): void;
    updateSize(): void;
    width: any;
    height: any;
    onResizeTimeout: number | undefined;
    componentDidMount(): void;
    resizeSensor: ResizeSensor | undefined;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
}
import Component from "../component";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
