import React, { createRef, type RefObject } from "react";
import { randomS4, eventHandler } from "dbl-utils";

import Component, {
  type ComponentProps,
  type ComponentState,
} from "../component";

export interface FormContainerFieldConfig {
  name?: string;
  default?: unknown;
  [key: string]: unknown;
}

export type FormContainerField =
  | string
  | FormContainerFieldConfig
  | null
  | undefined
  | false;

export type FormContainerFields =
  | FormContainerField[]
  | Record<string, FormContainerField>;

export interface FormContainerProps extends ComponentProps {
  label?: React.ReactNode;
  labelClasses?: string;
  fields?: FormContainerFields;
}

export interface FormContainerState extends ComponentState {
  data: Record<string, unknown>;
  invalidFields: Record<string, unknown>;
  defaultValues: Record<string, unknown>;
}

interface FormContainerUpdatePayload {
  data?: Record<string, unknown>;
  reset?: boolean;
  default?: Record<string, unknown>;
  update?: boolean;
  clearData?: boolean;
  mergeDefault?: boolean;
}

type EventTuple = [string, (...args: any[]) => void, string];

export default class FormContainer extends Component<
  FormContainerProps,
  FormContainerState
> {
  static override jsClass = "FormContainer";
  static override defaultProps: Partial<FormContainerProps> = {
    ...Component.defaultProps,
    fields: [],
  };

  unique = randomS4();
  form: RefObject<HTMLFormElement>;

  state: FormContainerState = {
    localClasses: "",
    localStyles: {},
    data: {},
    invalidFields: {},
    defaultValues: {},
  };

  private events: EventTuple[] = [];
  private readyEvents: EventTuple[] = [];
  private timeoutInvalid?: ReturnType<typeof setTimeout>;
  private timeoutOnChange?: ReturnType<typeof setTimeout>;
  private timeoutCheckValidity?: ReturnType<typeof setTimeout>;
  private mergeDefault?: boolean | null;

  private readonly handleReadyOnce = (): void => {
    this.readyEvents.forEach(([eventName]) =>
      eventHandler.unsubscribe(eventName, this.unique)
    );
    this.readyEvents = [];
    eventHandler.dispatch(`ready.${this.props.name}`);
  };

  constructor(props: FormContainerProps) {
    super(props);
    this.form = createRef<HTMLFormElement>();
    this.onChange = this.onChange.bind(this);
    this.checkValidity = this.checkValidity.bind(this);

    this.events = [
      [`update.${props.name}`, this.onUpdate, this.unique],
      [`default.${props.name}`, this.onDefault, this.unique],
    ];

    this.fieldsForEach((field) => {
      if (!field?.name) return;
      this.events.push([field.name, this.onChange, this.unique]);
      this.events.push([`invalid.${field.name}`, this.onInvalidField, this.unique]);
      this.readyEvents.push([
        `ready.${field.name}`,
        this.handleReadyOnce,
        this.unique,
      ]);
      if (typeof field.default !== "undefined") {
        this.state.defaultValues[field.name] = field.default;
      }
    });

    delete this.eventHandlers.onChange;
  }

  override componentDidMount(): void {
    this.events.forEach((event) => eventHandler.subscribe(...event));
    this.readyEvents.forEach((event) => eventHandler.subscribe(...event));
    this.reset();
  }

  override componentWillUnmount(): void {
    clearTimeout(this.timeoutInvalid);
    clearTimeout(this.timeoutOnChange);
    clearTimeout(this.timeoutCheckValidity);
    this.events.forEach(([eventName]) =>
      eventHandler.unsubscribe(eventName, this.unique)
    );
    this.readyEvents.forEach(([eventName]) =>
      eventHandler.unsubscribe(eventName, this.unique)
    );
  }

  override get componentProps(): Record<string, unknown> | undefined {
    const baseProps: Record<string, any> = {
      ...(this.props._props as Record<string, any> | undefined),
    };
    if (typeof baseProps.onChange === "function") {
      const originalOnChange = baseProps.onChange;
      baseProps.onChange = () => {
        clearTimeout(this.timeoutOnChange);
        this.timeoutOnChange = setTimeout(
          () => originalOnChange(this.state.data),
          310
        );
      };
    }
    return baseProps;
  }

  private checkValidity(): void {
    clearTimeout(this.timeoutCheckValidity);
    this.timeoutCheckValidity = setTimeout(() => {
      if (this.form.current?.checkValidity()) {
        eventHandler.dispatch(`valid.${this.props.name}`, this.state.data);
      }
    }, 310);
  }

  private fieldsForEach(
    callback: (field: FormContainerFieldConfig, index: number) => void
  ): void {
    const { fields } = this.props;
    if (!fields) return;

    if (Array.isArray(fields)) {
      fields.forEach((field, index) => {
        if (!field) return;
        const normalized: FormContainerFieldConfig =
          typeof field === "string"
            ? { name: field }
            : { ...field };
        if (!normalized.name) normalized.name = `field-${index}`;
        callback(normalized, index);
      });
      return;
    }

    Object.keys(fields).forEach((name, index) => {
      const field = fields[name];
      if (!field) return;
      const normalized: FormContainerFieldConfig =
        typeof field === "string"
          ? { name: field }
          : { name, ...field };
      if (!normalized.name) normalized.name = name;
      callback(normalized, index);
    });
  }

  private onUpdate = ({
    data,
    reset,
    default: dataDefault,
    update = true,
    clearData,
    mergeDefault,
  }: FormContainerUpdatePayload): void => {
    if (clearData) {
      this.setState({ data: {} });
    }
    if (dataDefault) {
      this.mergeDefault = mergeDefault;
      this.onDefault(dataDefault);
    }
    if (data) {
      if (update) {
        Object.keys(data).forEach((fieldName) => {
          eventHandler.dispatch(`update.${fieldName}`, { value: data[fieldName] });
        });
      }
      this.setState(
        (prev) => ({ data: { ...prev.data, ...data } }),
        this.checkValidity
      );
    }
    if (typeof reset === "boolean") {
      this.reset();
    }
  };

  private onDefault = (data: Record<string, unknown>): void => {
    const defaultValues: Record<string, unknown> = {};
    this.fieldsForEach((field) => {
      if (!field.name) return;
      defaultValues[field.name] = data[field.name];
    });
    if (this.mergeDefault) {
      Object.assign(this.state.defaultValues, defaultValues);
    } else {
      this.state.defaultValues = defaultValues;
    }
    this.mergeDefault = null;
  };

  reset(): void {
    this.fieldsForEach((field) => {
      if (!field.name) return;
      if (this.state.defaultValues[field.name] !== undefined) {
        eventHandler.dispatch(`update.${field.name}`, {
          value: this.state.defaultValues[field.name],
        });
      } else {
        eventHandler.dispatch(`update.${field.name}`, {
          clear: true,
          error: false,
        });
      }
    });
    this.setState({ data: {} });
  }

  private onInvalid = (_e: React.FormEvent<HTMLFormElement>): void => {
    clearTimeout(this.timeoutInvalid);
    this.timeoutInvalid = setTimeout(() => {
      eventHandler.dispatch(`invalid.${this.props.name}`, this.state.invalidFields);
    }, 400);
  };

  private onInvalidField = (invalidData: Record<string, unknown>): void => {
    Object.assign(this.state.invalidFields, invalidData);
  };

  private onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = this.state;
    eventHandler.dispatch(this.props.name, data);
  };

  private onChange(fieldData: Record<string, unknown>): void {
    this.setState(({ data, invalidFields }) => {
      const nextInvalid = { ...invalidFields };
      Object.keys(fieldData).forEach((key) => delete nextInvalid[key]);
      const nextData = { ...data, ...fieldData };
      return {
        data: nextData,
        invalidFields: nextInvalid,
      };
    }, () => {
      const { data } = this.state;
      eventHandler.dispatch(`change.${this.props.name}`, data);
      this.checkValidity();
    });
  }

  override content(
    children: React.ReactNode = this.props.children
  ): React.ReactNode {
    const { label, labelClasses, name } = this.props;
    return (
      <form
        id={`${name}-form`}
        onSubmit={this.onSubmit}
        onInvalid={this.onInvalid}
        ref={this.form}
      >
        {label && <label className={labelClasses}>{label}</label>}
        {children}
      </form>
    );
  }
}
