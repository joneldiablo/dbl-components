import React from "react";
import moment from "moment";

import { resolveRefs, eventHandler } from "dbl-utils";

import JsonRender from "../../json-render";
import Field, { type FieldProps } from "./field";

const schemaInput = {
  control: {
    name: ["$definitions/name", "wrapControl"],
    tag: "div",
    classes: "input-group",
    style: {
      flexWrap: "nowrap",
    },
    content: {
      from: {
        name: ["$definitions/name", "fromControl"],
        wrapper: false,
        component: "NoWrapField",
        controlClasses: "border-end-0",
        type: "$definitions/type",
        style: {
          minWidth: 50,
        },
      },
      divisor: {
        name: ["$definitions/name", "divisor"],
        tag: "span",
        classes: "input-group-text border-start-0  border-end-0",
        content: "$definitions/divisor",
      },
      to: {
        name: ["$definitions/name", "toControl"],
        wrapper: false,
        component: "NoWrapField",
        controlClasses: "border-start-0",
        type: "$definitions/type",
        style: {
          minWidth: 50,
        },
      },
    },
  },
  definitions: {},
};

export interface RangeFieldProps extends FieldProps {
  from?: Record<string, unknown>;
  to?: Record<string, unknown>;
  divisor?: React.ReactNode;
}

interface RangeFieldState {
  min?: number | string | null;
  max?: number | string | null;
}

export default class RangeField extends Field<RangeFieldProps> {
  declare props: RangeFieldProps;
  declare state: Field["state"] & RangeFieldState;

  static override jsClass = "RangeField";
  static override defaultProps: Partial<RangeFieldProps> = {
    ...Field.defaultProps,
    type: "number",
    default: [],
    from: {},
    to: {},
    divisor: "-",
    controlClasses: [],
  };

  private events: Array<[string, (...args: any[]) => void]> = [];
  private jsonRender: JsonRender;
  private schemaInput: any;

  constructor(props: RangeFieldProps) {
    super(props);
    this.jsonRender = new JsonRender(props, this.mutations);
    this.schemaInput = resolveRefs(schemaInput.control, {
      definitions: {
        ...schemaInput.definitions,
        name: props.name,
        type: props.type,
        divisor: props.divisor,
      },
    });
    const currentValue = Array.isArray(this.state.value)
      ? this.state.value
      : [null, null];
    this.state = {
      ...this.state,
      min: currentValue[0] ?? null,
      max: currentValue[1] ?? null,
    };
    this.events = [
      [`update.${props.name}-fromControl`, this.onValuesChange],
      [`update.${props.name}-toControl`, this.onValuesChange],
      [`invalid.${props.name}-fromControl`, this.onAnyInvalid],
      [`invalid.${props.name}-toControl`, this.onAnyInvalid],
      [`focus.${props.name}-fromControl`, this.onAnyFocus],
      [`focus.${props.name}-toControl`, this.onAnyFocus],
    ];
  }

  override componentDidMount(): void {
    super.componentDidMount();
    this.events.forEach(([evt, handler]) => eventHandler.subscribe(evt, handler));
  }

  override componentWillUnmount(): void {
    super.componentWillUnmount();
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt));
  }

  override onUpdate(update: any): void {
    super.onUpdate(update);
    const { value } = update as { value?: [any, any] | null };
    if (value === undefined) return;
    const [from, to] = value === null || value === "" ? [null, null] : value;
    this.setState({ min: from, max: to } as Partial<RangeFieldState>);
    eventHandler.dispatch(`update.${this.props.name}-fromControl`, { value: from });
    eventHandler.dispatch(`update.${this.props.name}-toControl`, { value: to });
  }

  override get inputNode(): React.ReactNode {
    return this.jsonRender.buildContent(this.schemaInput, 0);
  }

  private onValuesChange = (data: Record<string, any>): void => {
    const newState: RangeFieldState = {};
    const fromKey = `${this.props.name}-fromControl`;
    const toKey = `${this.props.name}-toControl`;
    if (fromKey in data) {
      const raw = data[fromKey];
      let min = raw;
      if ((this.props.type || this.type) === "number") min = Number(raw);
      newState.min = min;
    }
    if (toKey in data) {
      const raw = data[toKey];
      let max = raw;
      if ((this.props.type || this.type) === "number") max = Number(raw);
      newState.max = max;
    }
    this.setState(newState as Partial<RangeFieldState>, () =>
      super.onChange({
        target: {
          value: [this.state.min, this.state.max],
        },
      } as any)
    );
  };

  override isInvalid(value: any): boolean {
    const [min, max] = value || [];
    let invalid = true;
    switch (this.props.type) {
      case "date":
      case "time":
        invalid = !(max && min) || moment(min).isAfter(max);
        break;
      default:
        invalid =
          !(typeof max === "number" && typeof min === "number") || min > max;
        break;
    }
    return invalid;
  }

  private onAnyInvalid = (): void => {
    this.onInvalid();
  };

  private onAnyFocus = (): void => {
    this.onFocus();
  };

  private mutations = (name: string, conf: any): any => {
    const baseProps = this.props;
    const { value: v = [] } = this.state;
    switch (name) {
      case `${baseProps.name}-fromControl`:
      case `${baseProps.name}-toControl`: {
        const {
          autoComplete,
          list,
          pattern,
          required,
          type,
          disabled,
          min,
          max,
          step,
          noValidate,
          readOnly,
          dir,
          accept,
          multiple,
          maxLength,
          minLength,
        } = baseProps;
        const index = name.endsWith("fromControl") ? 0 : 1;
        const minMaxKey = name.endsWith("fromControl") ? "max" : "min";
        const controlClasses = new Set(
          [baseProps.controlClasses]
            .flat()
            .filter(Boolean as any)
            .flatMap((cls: string) => String(cls).split(" "))
        );
        if (readOnly) controlClasses.add("form-control-plaintext");
        else controlClasses.delete("form-control-plaintext");

        return {
          autoComplete,
          list,
          pattern,
          required,
          type,
          disabled,
          min,
          max,
          step,
          noValidate,
          readOnly,
          dir,
          accept,
          multiple,
          maxLength,
          minLength,
          value: Array.isArray(v) ? v[index] : undefined,
          ...((name.endsWith("fromControl") ? baseProps.from : baseProps.to) || {}),
          type: baseProps.type,
          [minMaxKey]: (this.state as any)[minMaxKey],
          controlClasses: Array.from(controlClasses).flat().join(" "),
        };
      }
      case `${baseProps.name}-divisor`:
        return {
          content: baseProps.divisor,
        };
      default:
        break;
    }
    return conf;
  };
}
