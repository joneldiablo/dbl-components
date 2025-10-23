import React, { createRef, RefObject, Ref } from "react";
import type { Plugin } from "chart.js";

import { eventHandler } from "dbl-utils";

import ProportionalContainer, {
  type ProportionalContainerProps,
} from "../containers/proportional-container";
import Icons from "../media/icons";
import type { ComponentState } from "../component";
import {
  ensureDependency,
  formatDependencyError,
  logDependencyError,
} from "../utils/dependency-loader";

type ReactChartjsModule = typeof import("react-chartjs-2");

const graphs: Record<string, React.ComponentType<any>> = {};
let graphsLoaded = false;
let chartsLoadPromise: Promise<void> | null = null;
let chartsLoadError: Error | null = null;

async function ensureChartsLoaded(): Promise<void> {
  if (graphsLoaded) return;
  if (chartsLoadError) throw chartsLoadError;
  if (!chartsLoadPromise) {
    chartsLoadPromise = ensureDependency<ReactChartjsModule>("react-chartjs-2")
      .then((module) => {
        const chartExports: Partial<Record<string, React.ComponentType<any>>> = {
          Doughnut: (module as any).Doughnut,
          Bar: (module as any).Bar,
          Bubble: (module as any).Bubble,
          Chart: (module as any).Chart,
          Line: (module as any).Line,
          Pie: (module as any).Pie,
          PolarArea: (module as any).PolarArea,
          Radar: (module as any).Radar,
          Scatter: (module as any).Scatter,
        };
        Object.entries(chartExports).forEach(([key, component]) => {
          if (typeof component === "function") {
            graphs[key] = component;
          }
        });
        graphsLoaded = true;
      })
      .catch((error) => {
        chartsLoadError = error instanceof Error ? error : new Error(String(error));
        throw chartsLoadError;
      });
  }
  return chartsLoadPromise;
}

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

interface ChartjsState extends ComponentState {
  chartsReady: boolean;
}

export default class Chartjs extends ProportionalContainer {
  declare props: ChartjsProps;
  declare state: ChartjsState;
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
  private isComponentMounted = false;

  constructor(props: ChartjsProps) {
    super(props);
    this.events.push(
      [`ready.${props.name}`, this.onReadyElement.bind(this)],
      [`resize.${props.name}`, this.onResizeElement.bind(this)]
    );
    this.state = {
      ...this.state,
      chartsReady: false,
    };
  }

  override componentDidMount(): void {
    this.isComponentMounted = true;
    this.events.forEach(([event, callback]) =>
      eventHandler.subscribe(event, callback, this.name)
    );
    super.componentDidMount();
    void this.loadCharts();
  }

  override componentWillUnmount(): void {
    this.isComponentMounted = false;
    super.componentWillUnmount();
    this.events.forEach(([event]) => eventHandler.unsubscribe(event, this.name));
    if (this.timeoutUpdate) clearTimeout(this.timeoutUpdate);
  }

  private async loadCharts(): Promise<void> {
    try {
      await ensureChartsLoaded();
      if (this.isComponentMounted && !this.state.chartsReady) {
        this.setState({ chartsReady: true });
      }
      this.clearDependencyError();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logDependencyError("react-chartjs-2", err);
      if (this.isComponentMounted) {
        this.setDependencyError(formatDependencyError("react-chartjs-2"));
      }
    }
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
    const { chartsReady } = this.state;

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

    const GraphComponent = chartsReady ? graphs[graph as string] || graphs.Bar : undefined;
    const effectiveLoading = loading || !chartsReady || !GraphComponent;

    const chartContent = !effectiveLoading && GraphComponent ? (
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
