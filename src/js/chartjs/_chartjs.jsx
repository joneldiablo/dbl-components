import { createRef } from "react";
import PropTypes from "prop-types";
import { Doughnut, Bar, Bubble, Chart, Line, Pie, PolarArea, Radar, Scatter } from "react-chartjs-2";

import ProportionalContainer from "dbl-components/lib/js/containers/proportional-container";
import eventHandler from "dbl-components/lib/js/functions/event-handler";
import Icons from "dbl-components/lib/js/media/icons";

const graphs = {
  Doughnut, Bar, Bubble, Chart, Line, Pie, PolarArea, Radar, Scatter
};

export const addGraphs = (moreGraphs) => Object.assign(graphs, moreGraphs);

export default class Chartjs extends ProportionalContainer {

  static jsClass = 'Chartjs';
  static propTypes = {
    ...ProportionalContainer.propTypes,
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    ratio: PropTypes.oneOfType([PropTypes.number, PropTypes.objectOf(PropTypes.number)]),
    options: PropTypes.object,
    plugins: PropTypes.array,
    datasetIdKey: PropTypes.string,
    fallbackContent: PropTypes.node,
    updateMode: PropTypes.oneOf([
      'active', 'hide',
      'none', 'normal',
      'reset', 'resize',
      'show'
    ]),
    graph: PropTypes.string
  };
  static defaultProps = {
    ...ProportionalContainer.defaultProps,
    ratio: 1,
    options: {},
    plugins: [],
    datasetIdKey: 'label',
    fallbackContent: null,
    graph: 'Bar'
  }

  events = [];

  constructor(props) {
    super(props);
    this.refChart = createRef();
    this.events.push(
      ['ready.' + this.props.name, this.onReadyElement.bind(this)],
      ['resize.' + this.props.name, this.onResizeElement.bind(this)]
    );
    Object.assign(this.state, {
    });
  }

  componentDidMount() {
    this.events.forEach(([e, cb]) => eventHandler.subscribe(e, cb, this.name));
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.events.forEach(([e]) => eventHandler.unsubscribe(e, this.name));
    clearTimeout(this.timeoutUpdate);
  }

  onReadyElement(obj) {
  }

  onResizeElement(resize) {
    if (this.refChart.current)
      this.refChart.current.update();
  }

  content(children = this.props.children) {

    const options = { ...this.props.options };
    options.aspectRatio = 1 / (typeof ratio === 'object' ? this.props.ratio[this.breakpoint] : this.props.ratio);
    const attribs = {
      data: this.props.data,
      options,
      plugins: this.props.plugins,
      redraw: false,
      datasetIdKey: this.props.datasetIdKey,
      fallbackContent: this.props.fallbackContent,
      updateMode: this.props.updateMode,
      ref: (ref) => {
        this.refChart.current = ref;
        if (this.props.ref) this.props.ref.current = ref;
      }
    }
    const Graph = graphs[this.props.graph];
    const proportional = super.content(<>
      {!this.props.loading
        ? <Graph {...attribs} />
        : <Icons icon="spinner" classes="spinner" />
      }
      {children}
    </>
    );
    return proportional;
  }
}