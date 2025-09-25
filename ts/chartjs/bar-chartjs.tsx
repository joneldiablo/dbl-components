import Chartjs, { type ChartjsProps } from "./_chartjs";

export default class BarChartjs extends Chartjs {
  declare props: ChartjsProps;
  static override jsClass = "BarChartjs";
  static override defaultProps: Partial<ChartjsProps> = {
    ...Chartjs.defaultProps,
    graph: "Bar",
  };
}

