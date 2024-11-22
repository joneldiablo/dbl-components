import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { eventHandler } from 'dbl-utils';

import Component from '../component';

// INFO: a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 16,
  margin: '0 0 8px 0',
  background: isDragging ? 'lightgreen' : 'red',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'grey',
  padding: 8
});

export default class DndListContainer extends Component {

  static jsClass = 'DndListContainer';

  static defaultProps = {
    ...Component.defaultProps,
    droppableId: 'droppable',
    getListStyle,
    getItemStyle
  }

  constructor(props) {
    super(props);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state.items = this.itemsFilter(props.children);
    this.events = [
      ['update.' + props.name, this.onChangeOrder]
    ];
  }

  itemsFilter(items) {
    return Array.from(Array.isArray(items) ? items : [items]).filter(i => !!i)
  }

  componentDidMount() {
    this.events.forEach(e => eventHandler.subscribe(...e));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.children !== this.props.children) {
      this.setState({ items: this.itemsFilter(this.props.children) });
    }
  }

  componentWillUnmount() {
    this.events.forEach(([name]) => eventHandler.unsubscribe(name));
  }

  onDragStart() {

  }

  onDragEnd(result) {
    if (!result.destination) return;
    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index,
    );
    this.setState({ items });
    eventHandler.dispatch(this.props.name, items.map(i => i.key));
  }

  onChangeOrder = (itemKeys) => {
    const items = itemKeys.map(key => this.state.items.find(i => i.key === key));
    this.setState({ items });
  }

  content(children = this.props.children) {
    const { droppableId } = this.props;
    return (
      React.createElement(DragDropContext, { onDragEnd: this.onDragEnd },
        React.createElement(Droppable, { droppableId: droppableId },
          (droppableProvided, droppableSnapshot) => (
            React.createElement('div',
              {
                ref: droppableProvided.innerRef,
                style: this.props.getListStyle(droppableSnapshot.isDraggingOver)
              },
              this.state.items.map((item, index) => React.createElement(Draggable,
                { key: item.key, draggableId: item.key, index: index },
                (draggableProvided, draggableSnapshot) => (
                  React.createElement('div',
                    {
                      ref: draggableProvided.innerRef,
                      ...draggableProvided.draggableProps,
                      ...draggableProvided.dragHandleProps,
                      style: this.props.getItemStyle(
                        draggableSnapshot.isDragging,
                        draggableProvided.draggableProps.style,
                      )
                    },
                    item
                  )
                )
              )),
              droppableProvided.placeholder
            )
          )
        )
      )
    );
  }
}