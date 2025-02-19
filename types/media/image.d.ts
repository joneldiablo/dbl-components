export default class Image extends Component {
    static propTypes: {
        src: any;
        alt: any;
        width: any;
        height: any;
        objectFit: any;
        objectPosition: any;
        imageClasses: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        objectFit: string;
        objectPosition: string;
        imageClasses: string;
        style: {
            overflow: string;
        };
        classes: string;
        active: boolean;
    };
    content(): any;
}
import Component from "../component";
