/**
 * View component that extends JsonRenderContainer
 */
export default class View extends JsonRenderContainer {
    static propTypes: {
        test: any;
        content: any;
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
        test: boolean;
        content: {};
        fullWidth: boolean;
        view: null;
        childrenIn: boolean;
        definitions: {};
        fluid: boolean;
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
    componentDidUpdate(prevProps: any, prevState: any): void;
}
import JsonRenderContainer from "../containers/json-render-container";
