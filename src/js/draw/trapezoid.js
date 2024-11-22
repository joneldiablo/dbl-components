import React from "react";
import PropTypes from "prop-types";
import { Stage, Layer, Line } from "react-konva";

import Form from "../forms/form";
import FlexContainer from "../containers/flex-container";

export default class Trapezoid extends React.Component {

  static jsClass = 'Trapezoid';
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    sideB: PropTypes.number,
    high: PropTypes.number,
    sideA: PropTypes.number,
  }
  static defaultProps = {
    className: '',
    style: {}
  }

  state = {
    width: 0,
    height: 0,
    points: []
  };

  propsForm = {
    name: 'trapezoid',
    label: 'Trapecio',
    onChange: this.onChange.bind(this),
    fields: [
      {
        name: 'sideB',
        placeholder: 'Base Menor',
        type: 'number',
        min: 0,
        value: this.props.sideB
      },
      {
        name: 'high',
        placeholder: 'Altura',
        type: 'number',
        min: 0,
        value: this.props.high
      },
      {
        name: 'sideA',
        placeholder: 'Base Mayor',
        type: 'number',
        min: 0,
        value: this.props.sideA
      }
    ]
  }

  onChange({ sideA, sideB, high }) {
    if (!(sideA && sideB && high)) return;
    sideA = parseFloat(sideA);
    sideB = parseFloat(sideB);
    high = parseFloat(high);
    let diff = (sideA - sideB) / 2;
    let top = 0;
    let left = 0;
    let p1 = [(diff + left), (top)];
    let p2 = [(sideB + diff + left), (top)];
    let p3 = [(sideA + left), (top + high)];
    let p4 = [(left), (top + high)];
    if (diff < 0) {
      p1 = [left, top];
      p2 = [(sideB + left), (top)];
      p3 = [(sideA - diff + left), (top + high)];
      p4 = [(left - diff), (top + high)];
    }

    let points = [
      ...p1,
      ...p2,
      ...p3,
      ...p4
    ];
    this.setState({ points, high });
    let { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(points);
    }
  }

  setContainer = ref => {
    if (!ref) return;
    this.container = ref;
    this.setState({
      width: ref.offsetWidth,
      height: ref.offsetHeight
    });
  }

  drawSvg() {
    let { points, high } = this.state;
    if (!points.length) return;
    let propsStage = {
      width: this.state.width,
      height: Math.max(this.state.height, high + 2),
    };

    let propsLine = {
      points,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 1,
      closed: true,
    };

    return React.createElement(Stage, { ...propsStage },
      React.createElement(Layer,
        React.createElement(Line, { ...propsLine })
      )
    );
  }

  render() {
    let { className, style } = this.props;
    let content = [
      React.createElement(Form, { key: "0", ...this.propsForm }),
      React.createElement('div', { key: "1", className: "pl-3 h-100", ref: this.setContainer },
        this.drawSvg()
      )
    ];
    let cn = [this.constructor.jsClass, className].flat().join(' ');
    return (React.createElement('div',
      { className: cn, style: style },
      React.createElement(FlexContainer,
        { colClassNames: ['w-auto', 'w-100'] },
        content
      )
    ));
  }
}