import PropTypes from "prop-types";

import { eventHandler, resolveRefs, deepMerge } from "dbl-utils";

import JsonRender from "./json-render";
import Component from "./component";

export default class JsonRenderComponent extends Component {
  static jsClass = "JsonRenderComponent";
  static template = {
    view: {},
    definitions: {},
  };

  static propTypes = {
    ...Component.propTypes,
    view: PropTypes.object,
    childrenIn: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    definitions: PropTypes.object,
  };

  static defaultProps = {
    ...Component.defaultProps,
    view: null,
    childrenIn: false,
    definitions: {},
  };

  events = [];

  constructor(props) {
    super(props);
    Object.assign(this.state, {});
    this.jsonRender = new JsonRender(
      this.fixedProps,
      this.mutations.bind(this)
    );
    this.jsonRender.childrenIn = this.childrenIn;
  }

  get fixedProps() {
    return this.props;
  }

  get childrenIn() {
    return false;
  }

  get theView() {
    return this.constructor.template.view;
  }

  componentDidMount() {
    this.events.forEach(([evtName, callback]) =>
      eventHandler.subscribe(evtName, callback, this.name)
    );
    this.evalTemplate();
  }

  evalTemplate() {
    const definitions = deepMerge(
      this.constructor.template.definitions || {},
      this.props.definitions
    );

    this.templateSolved = this.props.view
      ? resolveRefs(this.props.view, {
          template: this.theView,
          definitions,
          props: this.props,
          state: this.state,
        })
      : resolveRefs(this.theView, {
          definitions,
          props: this.props,
          state: this.state,
        });
  }

  componentWillUnmount() {
    this.events.forEach(([eName]) =>
      eventHandler.unsubscribe(eName, this.name)
    );
  }

  mutations(sectionName, section) {
    return this.state[sectionName];
  }

  content(children = this.props.children) {
    const builded = this.jsonRender.buildContent(this.templateSolved);
    return this.props.childrenIn !== undefined && !this.props.childrenIn
      ? [builded, children]
      : builded;
  }
}
