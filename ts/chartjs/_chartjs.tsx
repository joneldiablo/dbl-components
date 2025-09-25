import React, { createRef, RefObject, Ref } from "react";
import {
  Doughnut,
  Bar,
  Bubble,
  Chart as ChartComponent,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
} from "react-chartjs-2";
import type { Plugin } from "chart.js";

import { eventHandler } from "dbl-utils";

import ProportionalContainer, {
  type ProportionalContainerProps,
} from "../containers/proportional-container";
import Icons from "../media/icons";

const graphs: Record<string, React.ComponentType<any>> = {
  Doughnut,
  Bar,
  Bubble,
  Chart: ChartComponent,
  Line,
  Pie,
  PolarArea,
  Radar,
  Scatter,
};

export const addGraphs = (moreGraphs: Record<string, React.ComponentType<any>>): void => {
  Object.assign(graphs, moreGraphs);
};

export interface ChartjsProps extends ProportionalContainerProps {
  data: any;
  ratio?: number | Record<string, number>;
  options?: Record<string, any>;
  plugins?: Plugin[];
  datasetIdKey?: string;
  fallbackContent?: React.ReactNode;
  updateMode?:
    | "active"
    | "hide"
    | "none"
    | "normal"
    | "reset"
    | "resize"
    | "show";
  graph?: keyof typeof graphs;
  loading?: boolean;
  chartRef?: Ref<any>;
}

export default class Chartjs extends ProportionalContainer {
  declare props: ChartjsProps;
  static override jsClass = "Chartjs";
  static override defaultProps: Partial<ChartjsProps> = {
    ...ProportionalContainer.defaultProps,
    ratio: 1,
    options: {},
    plugins: [],
    datasetIdKey: "label",
    fallbackContent: null,
    graph: "Bar",
  };

  events: Array<[string, (...args: unknown[]) => void]> = [];
  refChart: RefObject<any> = createRef();
  timeoutUpdate?: ReturnType<typeof setTimeout>;

  constructor(props: ChartjsProps) {
    super(props);
    this.events.push(
      [`ready.${props.name}`, this.onReadyElement.bind(this)],
      [`resize.${props.name}`, this.onResizeElement.bind(this)]
    );
  }

  override componentDidMount(): void {
    this.events.forEach(([event, callback]) =>
      eventHandler.subscribe(event, callback, this.name)
    );
    super.componentDidMount();
  }

  override componentWillUnmount(): void {
    super.componentWillUnmount();
    this.events.forEach(([event]) => eventHandler.unsubscribe(event, this.name));
    if (this.timeoutUpdate) clearTimeout(this.timeoutUpdate);
  }

  protected onReadyElement(): void {
    // placeholder to keep parity with JS implementation
  }

  protected onResizeElement(): void {
    if (this.refChart.current?.update) {
      this.refChart.current.update();
    }
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const {
      ratio = 1,
      options = {},
      plugins = [],
      data,
      datasetIdKey = "label",
      fallbackContent = null,
      updateMode,
      graph = "Bar",
      loading,
    } = this.props;

    const optionsClone = { ...options };
    const ratioValue =
      typeof ratio === "object" && this.breakpoint
        ? ratio[this.breakpoint]
        : ratio;
    const numericRatio = typeof ratioValue === "number" && ratioValue !== 0 ? ratioValue : 1;
    optionsClone.aspectRatio = 1 / numericRatio;

    const attribs = {
      data,
      options: optionsClone,
      plugins,
      redraw: false,
      datasetIdKey,
      fallbackContent,
      updateMode,
      ref: (ref: any) => {
        this.refChart.current = ref;
        const externalRef = this.props.chartRef;
        if (typeof externalRef === "function") externalRef(ref);
        else if (externalRef && typeof externalRef === "object")
          (externalRef as RefObject<any>).current = ref;
      },
    };

    const GraphComponent = graphs[graph as string] || graphs.Bar;

    const chartContent = !loading ? (
      <GraphComponent {...attribs} />
    ) : (
      <Icons icon="spinner" classes="spinner" />
    );

    return super.content(
      <>
        {chartContent}
        {children}
      </>
    );
  }
}
