export default class FetchContainer extends Component {
    static propTypes: {
        url: any;
        fetchProps: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    componentDidMount(): void;
    fetch(): Promise<void>;
}
import Component from "../component";
