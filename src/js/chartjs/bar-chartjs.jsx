import Chartjs from "./_chartjs";

export default class BarChartjs extends Chartjs {

  static jsClass = 'BarChartjs';
  static propTypes = {
    ...Chartjs.propTypes,
  };
  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: 'Bar'
  }
}