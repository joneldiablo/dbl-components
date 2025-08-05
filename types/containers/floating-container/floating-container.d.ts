declare function FloatingContainer({ name, floatAround, children, placement, card, offset, alignment, allowedPlacements, fallbackPlacements, classes, style }: {
    name: any;
    floatAround: any;
    children: any;
    placement: any;
    card?: boolean | undefined;
    offset: any;
    alignment: any;
    allowedPlacements: any;
    fallbackPlacements: any;
    classes?: string | undefined;
    style?: {} | undefined;
}): any;
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
}
export default FloatingContainer;
