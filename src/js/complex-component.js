import React from "react";

import { resolveRefs, eventHandler } from "dbl-utils";

import JsonRender from "./json-render";
import Component from "./component";

export const nameSuffixes = (sfxs = []) => {
  return sfxs.reduce((acum, item) => {
    acum['$name' + item] = ['join', ['$data/name', item], ''];
    return acum;
  }, {});
}

const schema = { view: { name: '$nameDummy', content: 'Remplazar esto' }, definitions: {} };

export default class ComplexComponent extends Component {

  static jsClass = 'Complex';
  static defaultProps = {
    ...Component.defaultProps,
    schema,
    definitions: {},
    classes: {
      '.': ''
    },
    rules: {
    }
  }

  events = [];

  constructor(props) {
    super(props);
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
    Object.assign(this.state, {
      view: this.buildView()
    });
  }

  componentDidMount() {
    this.events.forEach(e => eventHandler.subscribe(...e));
  }

  componentWillUnmount() {
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName));
  }

  buildView() {
    const { schema, rules, definitions, ...all } = this.props;
    schema.data = all;
    Object.assign(schema.definitions, definitions);
    return resolveRefs(schema.view, schema, rules);
  }

  mutations(sn) {
    return this.state[sn];
  }

  content(children = this.props.children) {
    const { childrenIn } = this.props;
    const content = this.jsonRender.buildContent(this.state.view);
    return React.createElement(React.Fragment, {},
      content,
      !childrenIn && children
    );
  }

}