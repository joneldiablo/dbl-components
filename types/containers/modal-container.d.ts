export default class ModalContainer extends Component {
    static defaultProps: {
        modal: {};
        modalClasses: string;
        headerClasses: string;
        bodyClasses: string;
        footerClasses: string;
        closeModalClasses: string;
        moveElement: boolean;
        headerTheme: null;
        classes: string;
        style: {};
        active: boolean;
    };
    events: string[];
    componentDidMount(): void;
    componentWillUnmount(): void;
    onClickClose: (e: any) => void;
    onUpdateModal: ({ open: showModal }: {
        open: any;
    }) => any;
    destroy: () => void;
    modal: any;
    onModalRef: (refOriginal: any) => void;
}
import Component from "../component";
