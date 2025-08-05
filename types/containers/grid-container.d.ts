export default class GridContainer extends Container {
    static defaultProps: {
        colClasses: never[];
        colTag: string;
        fullWidth: boolean;
        row: string;
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        fluid: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    grid(children: any, extraClasses: any): false | any[];
}
import Container from "./container";
