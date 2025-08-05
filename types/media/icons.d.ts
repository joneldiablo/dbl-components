export default class Icons {
    static propTypes: {
        className: any;
        classes: any;
        height: any;
        icon: any;
        inline: any;
        size: any;
        style: any;
        title: any;
        width: any;
    };
    static jsClass: string;
    static defaultProps: {
        inline: boolean;
        className: string;
        icon: null;
        style: {};
    };
    render(): any;
}
export function setIconSet(isIn: any): void;
export function addIcons(newSet: any): void;
export function searchIcon(icon: any): any;
