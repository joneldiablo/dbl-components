declare function FloatingContainer({ name, floatAround, children, placement, card, alignment, allowedPlacements, classes, styles }: {
    name: any;
    floatAround: any;
    children: any;
    placement: any;
    card: any;
    alignment: any;
    allowedPlacements: any;
    classes: any;
    styles: any;
}): JSX.Element;
declare namespace FloatingContainer {
    let propTypes: {
        floatAround: any;
        placement: any;
        alignment: any;
        allowedPlacements: any;
        card: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    let defaultProps: {
        card: boolean;
        classes: string;
        style: {};
        active: boolean;
    };
}
export default FloatingContainer;
