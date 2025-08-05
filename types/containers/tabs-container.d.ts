export default class TabsContainer extends Container {
    onUpdate({ active }: {
        active: any;
    }): void;
    onClickTab: (e: any) => void;
    get tabNode(): any;
    get activeTabNode(): any;
    content(): any;
}
import Container from "./container";
