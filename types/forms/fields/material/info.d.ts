export default class HelpInputComponent {
    static propTypes: {
        message: any;
    };
    constructor(props: any);
    state: {
        element: null;
    };
    showPopup: (event: any) => void;
    hidePopup: () => void;
    render(): any;
}
