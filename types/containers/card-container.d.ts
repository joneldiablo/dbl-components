export default class CardContainer extends Container {
    static defaultProps: {
        fullWidth: boolean;
        headerClasses: string;
        bodyClasses: string;
        footerClasses: string;
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
}
import Container from "./container";
