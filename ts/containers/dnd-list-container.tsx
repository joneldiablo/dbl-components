import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "react-beautiful-dnd";

import { eventHandler } from "dbl-utils";

import Component, {
  type ComponentProps,
  type ComponentState,
} from "../component";

type ItemList = React.ReactElement[];

const reorder = (list: ItemList, startIndex: number, endIndex: number): ItemList => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const defaultItemStyle = (
  isDragging: boolean,
  draggableStyle?: React.CSSProperties
): React.CSSProperties => ({
  userSelect: "none",
  padding: 16,
  margin: "0 0 8px 0",
  background: isDragging ? "lightgreen" : "red",
  ...draggableStyle,
});

const defaultListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  background: isDraggingOver ? "lightblue" : "grey",
  padding: 8,
});

export interface DndListContainerProps extends ComponentProps {
  droppableId?: string;
  getItemStyle?: (
    isDragging: boolean,
    draggableStyle?: React.CSSProperties
  ) => React.CSSProperties;
  getListStyle?: (isDraggingOver: boolean) => React.CSSProperties;
}

interface DndListContainerState extends ComponentState {
  items: ItemList;
}

export default class DndListContainer extends Component<
  DndListContainerProps,
  DndListContainerState
> {
  static override jsClass = "DndListContainer";
  static override defaultProps: Partial<DndListContainerProps> = {
    ...Component.defaultProps,
    droppableId: "droppable",
    getItemStyle: defaultItemStyle,
    getListStyle: defaultListStyle,
  };

  private events: Array<[string, (payload: any) => void]> = [];

  state: DndListContainerState = {
    ...this.state,
    items: this.itemsFilter(this.props.children),
  } as DndListContainerState;

  constructor(props: DndListContainerProps) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.events = [[`update.${props.name}`, this.onChangeOrder]];
  }

  private itemsFilter(items: React.ReactNode): ItemList {
    return React.Children.toArray(items)
      .filter((item): item is React.ReactElement => React.isValidElement(item))
      .map((item) => item);
  }

  override componentDidMount(): void {
    this.events.forEach(([evt, cb]) => eventHandler.subscribe(evt, cb));
  }

  override componentDidUpdate(prevProps: Readonly<DndListContainerProps>): void {
    if (prevProps.children !== this.props.children) {
      this.setState({ items: this.itemsFilter(this.props.children) });
    }
  }

  override componentWillUnmount(): void {
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt));
  }

  private onDragEnd(result: DropResult): void {
    if (!result.destination) return;
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({ items });
    eventHandler.dispatch(
      this.props.name,
      items.map((item) => item.key)
    );
  }

  private onChangeOrder = (itemKeys: React.Key[]): void => {
    const items = itemKeys
      .map((key) => this.state.items.find((item) => item.key === key))
      .filter((item): item is React.ReactElement => Boolean(item));
    this.setState({ items });
  };

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { droppableId, getListStyle, getItemStyle } = this.props;
    const listStyle = getListStyle ?? defaultListStyle;
    const itemStyle = getItemStyle ?? defaultItemStyle;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={droppableId ?? "droppable"}>
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={listStyle(droppableSnapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable
                  key={item.key ?? index}
                  draggableId={String(item.key ?? index)}
                  index={index}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={itemStyle(
                        draggableSnapshot.isDragging,
                        draggableProvided.draggableProps.style as React.CSSProperties
                      )}
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
