export function addGraphs(moreGraphs: any): any;
export default class Chartjs extends ProportionalContainer {
    static propTypes: {
        data: any;
        ratio: any;
        options: any;
        plugins: any;
        datasetIdKey: any;
        fallbackContent: any;
        updateMode: any;
        graph: any;
        overflow: any;
        fluid: any;
        fullWidth: any;
        breakpoints: any;
        xsClasses: any;
        smClasses: any;
        mdClasses: any;
        lgClasses: any;
        xlClasses: any;
        xxlClasses: any;
        _props: any;
        active: any;
        children: any;
        classes: any;
        name: any;
        style: any;
        tag: any;
    };
    static defaultProps: {
        ratio: number;
        options: {};
        plugins: never[];
        datasetIdKey: string;
        fallbackContent: null;
        graph: string;
        overflow: string;
        fullWidth: boolean;
        fluid: boolean;
        breakpoints: {
            xs: number;
            sm: number;
            md: number;
            lg: number;
            xl: number;
            xxl: number;
        };
        classes: string;
        style: {};
        active: boolean;
    };
    events: any[];
    refChart: import("react").RefObject<any>;
    onReadyElement(obj: any): void;
    onResizeElement(resize: any): void;
}
import ProportionalContainer from "../containers/proportional-container";
