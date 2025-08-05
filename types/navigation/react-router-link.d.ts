export default class Link extends Component {
    static propTypes: any;
    tag: import("react").ForwardRefExoticComponent<import("react-router-dom").LinkProps & import("react").RefAttributes<HTMLAnchorElement>>;
    get componentProps(): {
        to: any;
        replace: any;
        ref: any;
        target: any;
        component: any;
    };
}
import Component from "../component";
