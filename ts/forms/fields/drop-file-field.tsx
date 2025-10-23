import React from "react";

import Field, { type FieldProps, type FieldState } from "./field";

/**
 * Props accepted by {@link DropFileField}.
 *
 * @example
 * ```tsx
 * <DropFileField name="files" label="Attachments" multiple accept="image/*" />
 * ```
 */
export interface DropFileFieldProps extends FieldProps {
  onDragOver?: React.DragEventHandler<HTMLInputElement>;
  onDragLeave?: React.DragEventHandler<HTMLInputElement>;
  onDrop?: React.DragEventHandler<HTMLInputElement>;
}

/**
 * Local state maintained by {@link DropFileField}.
 */
export interface DropFileFieldState extends FieldState {
  files: File[];
  valueInput: string;
}

/**
 * File input field that displays a dropzone container and tracks the selected files.
 *
 * The component reuses the {@link Field} lifecycle but keeps the real list of
 * {@link File} references under `state.files` while exposing a readable string through
 * `state.value`.
 *
 * @example
 * ```tsx
 * <DropFileField name="files" label="Upload files">
 *   <React.Fragment>
 *     <p>Drag & drop your files here</p>
 *     <p>Files ready!</p>
 *   </React.Fragment>
 * </DropFileField>
 * ```
 */
export default class DropFileField extends Field<DropFileFieldProps> {
  declare props: DropFileFieldProps;
  declare state: Field["state"] & DropFileFieldState;

  static override jsClass = "DropFileField";

  constructor(props: DropFileFieldProps) {
    super(props);
    const classSet = this.classSetFrom(this.state.localClasses);
    classSet.add("card");
    this.state = {
      ...this.state,
      localClasses: this.classSetToString(classSet),
      files: [],
      valueInput: "",
      value: this.normalizeValue(this.state.value),
    };
  }

  private classSetFrom(value?: string | string[]): Set<string> {
    const source = Array.isArray(value)
      ? value.flatMap((item) =>
          typeof item === "string" ? item.split(" ") : String(item).split(" ")
        )
      : String(value ?? "")
          .split(" ")
          .filter(Boolean);
    return new Set(source.filter(Boolean));
  }

  private classSetToString(classSet: Set<string>): string {
    return Array.from(classSet).filter(Boolean).join(" ");
  }

  private normalizeValue(value: unknown): string {
    if (Array.isArray(value)) {
      return value
        .map((item) =>
          typeof item === "string"
            ? item
            : item && typeof (item as File).name === "string"
            ? (item as File).name
            : String(item)
        )
        .filter(Boolean)
        .join(", ");
    }
    if (value === null || value === undefined) return "";
    return typeof value === "string" ? value : String(value);
  }

  private stringifyFiles(files: File[]): string {
    return files.map((file) => file.name).join(", ");
  }

  override onChange({ target }: React.ChangeEvent<HTMLInputElement>): void {
    const { value, files } = target;
    const classSet = this.classSetFrom(this.state.localClasses);
    classSet.delete("active");
    classSet.delete("filled");
    classSet.delete("border-danger");
    const filesArr = Array.from(files ?? []);
    const error = this.isInvalid(value);
    if (error) classSet.add("border-danger");
    if (filesArr.length) classSet.add("filled");
    this.setState(
      {
        value: this.stringifyFiles(filesArr),
        valueInput: value,
        files: filesArr,
        error,
        localClasses: this.classSetToString(classSet),
      } as any,
      () => this.returnData(filesArr)
    );
  }

  override onInvalid(): void {
    const classSet = this.classSetFrom(this.state.localClasses);
    classSet.delete("active");
    classSet.delete("filled");
    classSet.add("border-danger");
    this.setState({
      error: true,
      localClasses: this.classSetToString(classSet),
    } as any);
  }

  onDragover = (): void => {
    const classSet = this.classSetFrom(this.state.localClasses);
    classSet.add("active");
    classSet.delete("filled");
    classSet.delete("border-danger");
    this.setState({ localClasses: this.classSetToString(classSet) } as any);
  };

  onDragleave = (): void => {
    const classSet = this.classSetFrom(this.state.localClasses);
    classSet.delete("active");
    this.setState({ localClasses: this.classSetToString(classSet) } as any);
  };

  override onUpdate(update: { value?: unknown; reset?: boolean } & Record<string, any>): void {
    const classSet = this.classSetFrom(this.state.localClasses);
    classSet.delete("active");
    const newState: Partial<DropFileFieldState & FieldState> = {};
    if (typeof update.value !== "undefined" && update.value !== null) {
      if ((update.value as { length?: number }).length) classSet.add("filled");
      else classSet.delete("filled");
      newState.files = (Array.isArray(update.value) ? update.value : []) as File[];
    }
    if (update.reset) {
      if (!(newState as { length?: number }).length) classSet.delete("filled");
      else classSet.add("filled");
      newState.files = ((this.props.default as File[]) || []) as File[];
    }
    newState.localClasses = this.classSetToString(classSet);
    this.setState(newState as any);
    super.onUpdate(update);
  }

  override get type(): string {
    return "file";
  }

  override get inputProps(): Record<string, any> {
    const props = { ...super.inputProps };
    const { accept, multiple } = this.props;
    const { value, valueInput } = this.state;
    const hasValue = Array.isArray(value)
      ? (value as unknown[]).length > 0
      : Boolean(value);
    props.value = hasValue ? valueInput : value;
    props.accept = accept;
    props.multiple = multiple;
    props.onDragOver = this.onDragover;
    props.onDragLeave = this.onDragleave;
    props.onDrop = this.onDragleave;
    props.style = {
      ...(props.style || {}),
      opacity: 0,
      position: "absolute",
      width: "100%",
      top: 0,
      left: 0,
      height: "100%",
      cursor: "pointer",
    };
    return props;
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { label } = this.props;
    const { value } = this.state;
    const valueText = typeof value === "string" ? value : this.normalizeValue(value);
    const hasValue = Boolean(valueText);
    const childrenArray = React.Children.toArray(children);
    return React.createElement(
      "div",
      { className: "card-body" },
      !hasValue && label ? this.labelNode : null,
      childrenArray.length
        ? !hasValue
          ? childrenArray[0]
          : childrenArray[1] ?? valueText
        : null,
      this.inputNode,
      React.createElement("div", {}, this.errorMessageNode),
      !childrenArray.length && hasValue
        ? React.createElement("p", {}, valueText)
        : null
    );
  }
}
