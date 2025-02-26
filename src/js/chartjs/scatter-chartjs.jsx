import Chartjs from "./_chartjs";

export default class ScatterChartjs extends Chartjs {

  static jsClass = 'ScatterChartjs';
  static propTypes = {
    ...Chartjs.propTypes,
  };
  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: 'Scatter'
  }
}