export default class SlideContainer extends Container {
    static defaultProps: {
        fullWidth: boolean;
        slider: {
            options: {
                perPage: number;
                rewind: boolean;
            };
        };
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
