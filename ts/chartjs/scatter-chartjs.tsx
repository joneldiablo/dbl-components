import Chartjs, { type ChartjsProps } from "./_chartjs";

export default class ScatterChartjs extends Chartjs {
  declare props: ChartjsProps;
  static override jsClass = "ScatterChartjs";
  static override defaultProps: Partial<ChartjsProps> = {
    ...Chartjs.defaultProps,
    graph: "Scatter",
  };
}

