import Chartjs from "./_chartjs";

export default class LineChartjs extends Chartjs {

  static jsClass = 'LineChartjs';
  static propTypes = {
    ...Chartjs.propTypes,
  };
  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: 'Line'
  }
}