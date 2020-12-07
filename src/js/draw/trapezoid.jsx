import React from "react";
import Form from "../forms/form";
import FlexContainer from "../containers/flex-container";
import { Stage, Layer, Line } from "react-konva";

export default class Trapezoid extends React.Component {

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
        min: 0
      },
      {
        name: 'high',
        placeholder: 'Altura',
        type: 'number',
        min: 0
      },
      {
        name: 'sideA',
        placeholder: 'Base Mayor',
        type: 'number',
        min: 0
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

    return <Stage {...propsStage}>
      <Layer>
        <Line {...propsLine} />
      </Layer>
    </Stage>;
  }

  render() {
    let { className, style } = this.props;
    let content = [
      <Form key="0" {...this.propsForm} />,
      <div key="1" className="pl-3 h-100" ref={this.setContainer}>
        {this.drawSvg()}
      </div>
    ];
    let cn = [this.constructor.name, className].join(' ');
    return (<div className={cn} style={style}>
      <FlexContainer colClassNames={['w-auto', 'w-100']}>
        {content}
      </FlexContainer>
    </div>);
  }
}