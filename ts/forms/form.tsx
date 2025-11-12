import React, { createRef, RefObject } from "react";
import { randomS4, eventHandler } from "dbl-utils";

import Component, { ComponentProps, ComponentState } from "../component";
import fieldComponents, { addFields } from "./fields";
import type { FieldDefinition, FormUpdatePayload } from "./types";

/**
 * Props accepted by the {@link Form} component.
 *
 * @example
 * const props: FormProps = { name: "contact" };
 */
export interface FormProps extends ComponentProps {
  label?: React.ReactNode;
  labelClasses?: string | string[];
  fieldClasses?: string | string[];
  fields?: FieldDefinition[];
}

/**
 * Internal form state tracking serialized values and invalid fields.
 *
 * @example
 * const state: FormState = { localClasses: "", localStyles: {}, data: {}, invalidFields: {} };
 */
export interface FormState extends ComponentState {
  data: Record<string, any>;
  invalidFields: Record<string, any>;
}

/**
 * Bootstrap based form controller that wires field components together through the event bus.
 *
 * @example
 * <Form name="contact" fields={[{ type: "Field", name: "email", label: "Email" }]} />
 */
export default class Form<P extends FormProps = FormProps> extends Component<P, FormState> {
  static jsClass = "Form";
  static defaultProps: Partial<FormProps> = {
    ...Component.defaultProps,
    fieldClasses: "mb-3",
    fields: [],
  };

  unique = randomS4();
  allFields: Record<string, FieldDefinition> = {};
  form: RefObject<HTMLFormElement | null>;
  timeoutInvalid?: ReturnType<typeof setTimeout>;

  state: FormState = {
    localClasses: "",
    localStyles: {},
    data: {},
    invalidFields: {},
  };

  constructor(props: P) {
    super(props);
    this.form = createRef<HTMLFormElement>();
    this.mapFields = this.mapFields.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(): void {
    Object.keys(this.allFields).forEach((fieldName) => {
      let prefix = "";
      if (fieldName.endsWith("-Form")) prefix = "change.";
      eventHandler.subscribe(prefix + fieldName, this.onChange, this.unique);
      eventHandler.subscribe("invalid." + fieldName, this.onInvalidField, this.unique);
    });
    eventHandler.subscribe("update." + this.props.name, this.onUpdate, this.unique);
    this.reset(true);
    this.toggleSubmit();
  }

  componentWillUnmount(): void {
    clearTimeout(this.timeoutInvalid);
    Object.keys(this.allFields).forEach((fieldName) => {
      let prefix = "";
      if (fieldName.endsWith("-Form")) prefix = "change.";
      eventHandler.unsubscribe(prefix + fieldName, this.unique);
      eventHandler.unsubscribe("invalid." + fieldName, this.unique);
    });
    eventHandler.unsubscribe("update." + this.props.name, this.unique);
  }

  reset(dontDispatch = false): void {
    const dataDefault: Record<string, any> = {};
    Object.keys(this.allFields).forEach((fieldName) => {
      const field = this.allFields[fieldName];
      if (!field?.name) return;
      dataDefault[field.name] = field.default;
      if (!dontDispatch) eventHandler.dispatch("update." + fieldName, { reset: true });
    });
    this.setState({ data: dataDefault });
  }

  onUpdate = ({ data, loading, reset }: FormUpdatePayload): void => {
    if (data) {
      Object.keys(data).forEach((itemName) => {
        const fieldName = Object.keys(this.allFields).find((name) => name.startsWith(itemName));
        if (fieldName) {
          eventHandler.dispatch("update." + fieldName, data[itemName]);
        }
      });
      this.setState((prev) => ({ data: { ...prev.data, ...data } }));
    }
    if (typeof loading === "boolean") {
      const enabled = !loading;
      this.toggleSubmit(enabled);
    }
    if (reset) {
      this.reset();
    }
  };

  onInvalid = (): void => {
    const { invalidFields } = this.state;
    clearTimeout(this.timeoutInvalid);
    this.timeoutInvalid = setTimeout(() => {
      eventHandler.dispatch("invalid." + this.props.name, invalidFields);
      this.toggleSubmit();
    }, 400);
  };

  onInvalidField = (invalidData: Record<string, any>): void => {
    Object.assign(this.state.invalidFields, invalidData);
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    const { data } = this.state;
    eventHandler.dispatch(this.props.name, data);
  };

  onChange(fieldData: Record<string, any>): void {
    this.setState(({ data, invalidFields }) => {
      const nextInvalid = { ...invalidFields };
      Object.keys(fieldData).forEach((key) => delete nextInvalid[key]);
      const nextData = { ...data, ...fieldData };
      return { data: nextData, invalidFields: nextInvalid };
    }, () => {
      const { data } = this.state;
      eventHandler.dispatch("change." + this.props.name, data);
      if (this.form.current?.checkValidity()) {
        eventHandler.dispatch("valid." + this.props.name, data);
        this.toggleSubmit(true);
      }
    });
  }

  toggleSubmit(enabled?: boolean): void {
    const formEl = this.form.current;
    if (!formEl) return;
    const submits = formEl.querySelectorAll<HTMLInputElement | HTMLButtonElement>("*[type=submit]");
    submits.forEach((s) => {
      s.disabled = !enabled;
    });
  }

  mapFields(field: FieldDefinition, i: number): React.ReactNode {
    const { fieldClasses } = this.props;
    const keyName = `${i}-${field.name ?? i}`;
    let FieldComponent: React.ComponentType<any> | undefined;
    if (field.type === "Form") FieldComponent = Form as unknown as React.ComponentType<any>;
    else {
      const isGroup = field.type?.toLowerCase().includes("group");
      const fallbackKey = isGroup ? "Group" : "Field";
      FieldComponent =
        (field.type && fieldComponents[field.type]) ||
        fieldComponents[fallbackKey] ||
        fieldComponents.Field;
      if (!isGroup && field.name) {
        this.allFields[field.name] = field;
      }
    }

    const classes = [field.classes, fieldClasses].flat().filter(Boolean).join(" ");
    const { fields: childFields, ...rest } = field;
    const fieldProps: Record<string, any> = {
      key: keyName,
      ...rest,
      classes,
    };
    if (childFields && field.type !== "Form") {
      fieldProps.children = childFields.map((child, index) => this.mapFields(child, index));
    }
    return React.createElement(FieldComponent ?? fieldComponents.Field, { ...fieldProps });
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { label, fields, labelClasses } = this.props;
    this.allFields = {};
    return React.createElement(
      "form",
      { onSubmit: this.onSubmit, onInvalid: this.onInvalid, ref: this.form },
      label && React.createElement("label", { className: labelClasses }, label),
      fields && fields.map((field, index) => this.mapFields(field, index)),
      children,
    );
  }
}

addFields({ Form });
