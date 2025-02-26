/**
 * OffcanvasContainer component to manage and display an offcanvas UI element.
 * @extends Component
 */
export default class OffcanvasContainer extends Component {
    static propTypes: {
        bodyClasses: any;
        closeClasses: any;
        footerClasses: any;
        headerClasses: any;
        labelClasses: any;
        label: any;
        labelTag: any;
        offcanvas: any;
        position: any;
        showClose: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        bodyClasses: string;
        closeClasses: string;
        footerClasses: string;
        headerClasses: string;
        labelClasses: string;
        labelTag: string;
        offcanvas: {};
        position: string;
        showClose: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
    /**
     * Constructor to initialize the component with given properties.
     * @param {object} props - The properties passed to the component.
     */
    constructor(props: object);
    children: {
        header: never[];
        body: never[];
        footer: never[];
        content: never[];
    };
    /**
     * Callback to initialize the offcanvas reference.
     * @param {HTMLElement} refOriginal - The original reference element.
     */
    onOffcanvasRef: (refOriginal: HTMLElement) => void;
    bsEvents: string[];
    schema: any;
    jsonRender: JsonRender;
    componentDidMount(): void;
    componentWillUnmount(): void;
    /**
     * Event handler for offcanvas events.
     * @param {Event} e - The event object.
     */
    onEvent: (e: Event) => void;
    /**
     * Event handler for updating the offcanvas visibility.
     * @param {object} param - The update parameters.
     * @param {boolean} param.open - Whether to show or hide the offcanvas.
     */
    onUpdateOffcanvas: ({ open: showOffcanvas }: {
        open: boolean;
    }) => any;
    /**
     * Destroy the offcanvas instance.
     */
    destroy: () => void;
    offcanvas: any;
    /**
     * Get the header content.
     * @returns {Array} - The header content.
     */
    get headerContent(): any[];
    /**
     * Get the body content.
     * @returns {Array} - The body content.
     */
    get bodyContent(): any[];
    /**
     * Get the footer content.
     * @returns {Array} - The footer content.
     */
    get footerContent(): any[];
    /**
     * Get the content for the offcanvas.
     * @returns {Array} - The offcanvas content.
     */
    get contentOffcanvas(): any[];
    /**
     * Method to categorize and render children elements. Used by the parent Class
     * @override
     * @param {Array|object} children - The children elements to categorize and render.
     * @SuppressWarnings unused
     * @returns {JSX.Element} - The rendered content.
     */
    override content(children?: any[] | object): JSX.Element;
    /**
     * Render the offcanvas container.
     * @returns {JSX.Element} - The rendered offcanvas container.
     */
    render(): JSX.Element;
    /**
     * Function to apply specific mutations based on the name and configuration.
     * @param {string} name - The name to determine which mutation to apply.
     * @param {object} conf - The configuration object for the mutation.
     * @returns {(boolean|object)} - Returns an object with mutation properties or false if no mutation is applied.
     */
    mutations(name: string, conf: object): (boolean | object);
}
import Component from "../../component";
import JsonRender from "../../json-render";
