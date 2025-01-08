export default class ListContainer extends Container {
    static defaultProps: {
        liClasses: never[];
        fullWidth: boolean;
        tag: string;
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
    li(children: any, extraClasses: any): false | any[];
}
import Container from "./container";
