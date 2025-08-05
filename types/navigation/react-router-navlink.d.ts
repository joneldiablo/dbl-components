export default class NavLink extends Component {
    static propTypes: any;
    tag: import("react").ForwardRefExoticComponent<import("react-router-dom").NavLinkProps & import("react").RefAttributes<HTMLAnchorElement>>;
    get componentProps(): {
        strict: any;
        'aria-current': any;
        to: any;
        replace: any;
        ref: any;
        end: any;
        component: any;
    };
}
import Component from "../component";
