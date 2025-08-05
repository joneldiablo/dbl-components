export default class DetailsContainer extends Component {
    static propTypes: {
        open: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    events: any[];
    onToggle(evt: any): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onUpdate({ open }: {
        open: any;
    }): void;
}
import Component from "../component";
