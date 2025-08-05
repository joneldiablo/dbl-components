export default class ComplexResponsiveComponent extends ComplexComponent {
    static defaultProps: {
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        schema: {
            view: {
                name: string;
                content: string;
            };
            definitions: {};
        };
        definitions: {};
        classes: {
            '.': string;
        };
        rules: {};
        style: {};
        active: boolean;
    };
    resizeSensor: ResizeSensor | undefined;
    onResize: () => void;
    onResizeTimeout: number | undefined;
    breakpoint: string | undefined;
}
import ComplexComponent from "./complex-component";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
