export default class HeroContainer extends Container {
    static defaultProps: {
        fullWidth: boolean;
        fluid: boolean;
        spaceBetween: number;
        slidesPerView: number;
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
    onSlideChange: () => void;
    onSwiper: (swipe: any) => void;
}
import Container from "./container";
