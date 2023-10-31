import React from "react";

import JsonRender from "../../json-render";
import resolveRefs from "../../functions/resolve-refs";
import Field from "./field";

const schemaInput = {
  control: {
    name: ['$definitions/name', 'wrapControl'],
    tag: 'div',
    classes: 'input-group',
    style: {
      flexWrap: 'nowrap'
    },
    content: {
      from: {
        name: ['$definitions/name', 'fromControl'],
        tag: 'input',
        classes: 'form-control  border-end-0',
        _props: {
          type: '$definitions/type'
        },
        style: {
          minWidth: 50
        }
      },
      divisor: {
        name: ['$definitions/name', 'divisor'],
        tag: 'span',
        classes: 'input-group-text bg-transparent  border-start-0  border-end-0',
        content: '-'
      },
      to: {
        name: ['$definitions/name', 'toControl'],
        tag: 'input',
        classes: 'form-control border-start-0',
        _props: {
          type: '$definitions/type'
        },
        style: {
          minWidth: 50
        }
      }
    }
  },
  definitions: {

  }
};

export default class RangeField extends Field {

  static jsClass = 'RangeField';
  static defaultProps = {
    ...Field.defaultProps,
    type: 'number',
    default: []
  }

  constructor(props) {
    super(props);
    this.mutations = this.mutations.bind(this);
    this.jsonRender = new JsonRender(props, this.mutations);
    this.schemaInput = resolveRefs(schemaInput.control, {
      definitions: {
        ...schemaInput.definitions,
        name: props.name,
        type: props.type
      }
    });
  }

  get inputNode() {
    return this.jsonRender.buildContent(this.schemaInput, 0);
  }

  mutations(name, section) {
    switch (name) {
      case ''
    }
  }
}