export default class Trapezoid {
    static jsClass: string;
    static propTypes: {
        className: any;
        style: any;
        onChange: any;
        sideB: any;
        high: any;
        sideA: any;
    };
    static defaultProps: {
        className: string;
        style: {};
    };
    state: {
        width: number;
        height: number;
        points: never[];
    };
    propsForm: {
        name: string;
        label: string;
        onChange: ({ sideA, sideB, high }: {
            sideA: any;
            sideB: any;
            high: any;
        }) => void;
        fields: {
            name: string;
            placeholder: string;
            type: string;
            min: number;
            value: any;
        }[];
    };
    onChange({ sideA, sideB, high }: {
        sideA: any;
        sideB: any;
        high: any;
    }): void;
    setContainer: (ref: any) => void;
    container: any;
    drawSvg(): any;
    render(): any;
}
