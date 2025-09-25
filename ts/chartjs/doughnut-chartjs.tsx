import Chartjs, { type ChartjsProps } from "./_chartjs";

export default class DoughnutChartjs extends Chartjs {
  declare props: ChartjsProps;
  static override jsClass = "DoughnutChartjs";
  static override defaultProps: Partial<ChartjsProps> = {
    ...Chartjs.defaultProps,
    graph: "Doughnut",
  };
}

