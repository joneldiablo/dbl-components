export default class DndListContainer extends Component {
    static defaultProps: {
        droppableId: string;
        getListStyle: (isDraggingOver: any) => {
            background: string;
            padding: number;
        };
        getItemStyle: (isDragging: any, draggableStyle: any) => any;
        classes: string;
        style: {};
        active: boolean;
    };
    onDragStart(): void;
    onDragEnd(result: any): void;
    events: (string | ((itemKeys: any) => void))[][];
    itemsFilter(items: any): any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any, prevState: any): void;
    componentWillUnmount(): void;
    onChangeOrder: (itemKeys: any) => void;
}
import Component from '../component';
