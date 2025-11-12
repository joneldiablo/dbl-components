import React from "react";
import { Stage, Layer, Line } from "react-konva";

import Form from "../forms/form";
import type { FieldDefinition } from "../forms/types";
import FlexContainer from "../containers/flex-container";

export interface TrapezoidProps {
  className?: string;
  style?: React.CSSProperties;
  onChange?: (points: number[]) => void;
  sideB?: number;
  high?: number;
  sideA?: number;
}

interface TrapezoidState {
  width: number;
  height: number;
  points: number[];
  high: number;
}

/**
 * Helper component that renders a trapezoid preview using react-konva and exposes the
 * calculated coordinates through a form-based UI.
 */
export default class Trapezoid extends React.Component<TrapezoidProps, TrapezoidState> {
  static jsClass = "Trapezoid";
  static defaultProps: Partial<TrapezoidProps> = {
    className: "",
    style: {},
  };

  private container: HTMLDivElement | null = null;

  state: TrapezoidState = {
    width: 0,
    height: 0,
    points: [],
    high: this.props.high ?? 0,
  };

  constructor(props: TrapezoidProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  private get formDefinition(): { name: string; label: string; fields: FieldDefinition[]; onChange: (data: Record<string, any>) => void } {
    const { sideA, sideB, high } = this.props;
    return {
      name: "trapezoid",
      label: "Trapecio",
      onChange: this.onChange,
      fields: [
        {
          name: "sideB",
          placeholder: "Base Menor",
          type: "number",
          min: 0,
          value: sideB,
        },
        {
          name: "high",
          placeholder: "Altura",
          type: "number",
          min: 0,
          value: high,
        },
        {
          name: "sideA",
          placeholder: "Base Mayor",
          type: "number",
          min: 0,
          value: sideA,
        },
      ],
    };
  }

  onChange({ sideA, sideB, high }: Record<string, any>): void {
    if (!(sideA && sideB && high)) return;
    const baseA = parseFloat(sideA);
    const baseB = parseFloat(sideB);
    const trapezoidHigh = parseFloat(high);
    const diff = (baseA - baseB) / 2;
    const top = 0;
    const left = 0;

    let p1: [number, number] = [diff + left, top];
    let p2: [number, number] = [baseB + diff + left, top];
    let p3: [number, number] = [baseA + left, top + trapezoidHigh];
    let p4: [number, number] = [left, top + trapezoidHigh];

    if (diff < 0) {
      p1 = [left, top];
      p2 = [baseB + left, top];
      p3 = [baseA - diff + left, top + trapezoidHigh];
      p4 = [left - diff, top + trapezoidHigh];
    }

    const points = [...p1, ...p2, ...p3, ...p4];
    this.setState({ points, high: trapezoidHigh });
    if (typeof this.props.onChange === "function") {
      this.props.onChange(points);
    }
  }

  private setContainer = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    this.container = ref;
    this.setState({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
  };

  private drawStage(): React.ReactNode {
    const { points, high } = this.state;
    if (!points.length) return null;

    const stageProps = {
      width: this.state.width,
      height: Math.max(this.state.height, high + 2),
    };

    const lineProps = {
      points,
      fill: "#00D2FF",
      stroke: "black",
      strokeWidth: 1,
      closed: true,
    };

    return (
      <Stage {...stageProps}>
        <Layer>
          <Line {...lineProps} />
        </Layer>
      </Stage>
    );
  }

  override render(): React.ReactNode {
    const { className = "", style } = this.props;
    const content = [
      <Form key="0" {...this.formDefinition} />,
      <div key="1" className="pl-3 h-100" ref={this.setContainer}>
        {this.drawStage()}
      </div>,
    ];
    const cn = [Trapezoid.jsClass, className].filter(Boolean).join(" ");

    return (
      <div className={cn} style={style}>
        <FlexContainer colClassNames={["w-auto", "w-100"]}>{content}</FlexContainer>
      </div>
    );
  }
}
