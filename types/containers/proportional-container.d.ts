export default class ProportionalContainer extends Container {
    static propTypes: {
        ratio: any;
        overflow: any;
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
        ratio: string;
        overflow: string;
        fullWidth: boolean;
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
    ratioResponsive: any;
}
import Container from "./container";
