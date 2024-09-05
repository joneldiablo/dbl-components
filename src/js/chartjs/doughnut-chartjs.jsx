import Chartjs from "./_chartjs";

export default class DoughnutChartjs extends Chartjs {

  static jsClass = 'DoughnutChartjs';
  static propTypes = {
    ...Chartjs.propTypes,
  };
  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: 'Doughnut'
  }
}