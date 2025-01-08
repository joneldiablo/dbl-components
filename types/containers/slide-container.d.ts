export default class SlideContainer extends Component {
    static defaultProps: {
        slider: {
            options: {
                rewind: boolean;
            };
        };
        classes: string;
        style: {};
        active: boolean;
    };
}
import Component from "../component";
