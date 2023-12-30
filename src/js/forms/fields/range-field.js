import React from "react";

import resolveRefs from "../../functions/resolve-refs";
import eventHandler from "../../functions/event-handler";
import JsonRender from "../../json-render";
import Field from "./field";
import moment from "moment";

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
        wrapper: false,
        component: 'NoWrapField',
        controlClasses: 'border-end-0 text-end',
        type: '$definitions/type',
        style: {
          minWidth: 50
        }
      },
      divisor: {
        name: ['$definitions/name', 'divisor'],
        tag: 'span',
        classes: 'input-group-text border-start-0  border-end-0',
        content: '$definitions/divisor'
      },
      to: {
        name: ['$definitions/name', 'toControl'],
        wrapper: false,
        component: 'NoWrapField',
        controlClasses: 'border-start-0',
        type: '$definitions/type',
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
    default: [],
    from: {},
    to: {},
    divisor: '-'
  }

  events = [];

  constructor(props) {
    super(props);
    this.mutations = this.mutations.bind(this);
    this.jsonRender = new JsonRender(props, this.mutations);
    this.schemaInput = resolveRefs(schemaInput.control, {
      definitions: {
        ...schemaInput.definitions,
        name: props.name,
        type: props.type,
        divisor: props.divisor
      }
    });
    this.events.push(
      [`${this.props.name}-fromControl`, this.onValuesChange.bind(this)],
      [`${this.props.name}-toControl`, this.onValuesChange.bind(this)],

      [`invalid.${this.props.name}-fromControl`, this.onAnyInvalid.bind(this)],
      [`invalid.${this.props.name}-toControl`, this.onAnyInvalid.bind(this)],

      [`focus.${this.props.name}-fromControl`, this.onAnyFocus.bind(this)],
      [`focus.${this.props.name}-toControl`, this.onAnyFocus.bind(this)],

    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.events.forEach(evt => eventHandler.subscribe(...evt));
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.events.forEach(([evtName]) => eventHandler.unsubscribe(evtName));
  }

  get inputNode() {
    return this.jsonRender.buildContent(this.schemaInput, 0);
  }

  onValuesChange(data) {

    const newState = {};
    if (data[`${this.props.name}-fromControl`]) {
      let min = data[`${this.props.name}-fromControl`];
      if ((this.props.type || this.type) === 'number') min = Number(min);
      newState.min = min;
    }

    if (data[`${this.props.name}-toControl`]) {
      let max = data[`${this.props.name}-toControl`];
      if ((this.props.type || this.type) === 'number') max = Number(max);
      newState.max = max;
    }

    this.setState(newState,
      () => this.onChange({
        target: {
          value: [this.state.min, this.state.max]
        }
      })
    );

  }

  isInvalid(value) {
    const [min, max] = value;
    let isInvalid = true;
    switch (this.props.type) {
      case 'date':
      case 'time':
        isInvalid = !(max && min) || moment(min).isAfter(max);
        break;
      default:
        isInvalid = !(typeof max === 'number' && typeof min === 'number') || (min > max);
        break;
    }
    return isInvalid;
  }

  onAnyInvalid() {
    this.onInvalid();
  }

  onAnyFocus() {
    this.onFocus();
  }

  mutations(name, section) {

    switch (name) {
      case `${this.props.name}-fromControl`:
      case `${this.props.name}-toControl`: {
        const {
          autoComplete, list, pattern,
          required, type, disabled,
          min, max, step, noValidate,
          readOnly, dir, accept,
          multiple, maxLength, minLength,
          default: def, value: v
        } = this.props;
        const idef = name.endsWith('fromControl') ? 0 : 1;
        const ival = name.endsWith('fromControl') ? 0 : 1;
        const minMax = name.endsWith('fromControl') ? 'max' : 'min';
        const controlClasses = new Set(section.controlClasses.split(' '));
        let addDelete;
        if (readOnly) addDelete = 'add';
        else addDelete = 'delete';
        controlClasses[addDelete]('form-control-plaintext');
        return Object.assign(
          {
            autoComplete, list, pattern,
            required, type, disabled,
            min, max, step, noValidate,
            readOnly, dir, accept,
            multiple, maxLength, minLength,
            default: def[idef], value: v[ival]
          },
          name.endsWith('fromControl') ? this.props.from : this.props.to,
          {
            type: this.props.type,
            [minMax]: this.state[minMax],
            controlClasses: Array.from(controlClasses).flat().join(' ')
          });
      }
      case `${this.props.name}-divisor`: {
        const classes = new Set(section.classes.split(' '));
        let addDelete;
        if (this.props.readOnly) addDelete = 'add';
        else addDelete = 'delete';
        classes[addDelete]('border-0');
        return {
          classes: Array.from(classes).flat().join(' '),
          style: {
            backgroundColor: this.props.disabled ? 'var(--bs-secondary-bg)' : 'var(--bs-transparent-bg)'
          },
          content: this.props.divisor,
        }
      }
      default:
        break;
    }
  }
}