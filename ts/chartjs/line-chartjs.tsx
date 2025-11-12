import Chartjs, { type ChartjsProps } from "./_chartjs";

export default class LineChartjs extends Chartjs {
  declare props: ChartjsProps;
  static override jsClass = "LineChartjs";
  static override defaultProps: Partial<ChartjsProps> = {
    ...Chartjs.defaultProps,
    graph: "Line",
  };
}

