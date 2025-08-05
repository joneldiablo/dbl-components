export default class ModalButtonContainer extends Component {
    events: string[];
    onClickClose: (e: any) => void;
    onToggleModal: (e: any) => void;
    onModalRef: (ref: any) => void;
    modal: any;
}
import Component from "../component";
