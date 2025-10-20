import React from "react";
import bytes from "bytes";
import * as LZMAObj from "lzma/src/lzma_worker";

import { eventHandler } from "dbl-utils";

import JsonRender from "../../json-render";
import Field, { type FieldProps, type FieldState } from "./field";

type FileFieldFormat =
  | "base64"
  | "text"
  | "binaryString"
  | "zip"
  | "arrayBuffer"
  | "blob"
  | (string & {});

type FileFieldReadResult = string | ArrayBuffer | Uint8Array | number[] | File | null;

interface FileFieldStoredValue {
  name: string;
  file: FileFieldReadResult;
}

type FileFieldValue = FileFieldStoredValue[] | FileFieldStoredValue | string | null;

export interface FileFieldMutations {
  (name: string, section: any): any;
}

export interface FileFieldProps extends FieldProps {
  maxSize?: string | number;
  multiple?: boolean;
  format?: FileFieldFormat;
  zip?: boolean | number;
  mutations?: FileFieldMutations;
}

interface FileFieldState extends FieldState {
  value: FileFieldValue;
}

/**
 * Field that reads files from disk (or drag & drop), optionally compresses them with
 * LZMA and returns the processed payload back to the host form.
 *
 * @example
 * ```tsx
 * <FileField
 *   name="avatar"
 *   label="Upload avatar"
 *   format="base64"
 *   maxSize="5mb"
 * />
 * ```
 */
export default class FileField extends Field<FileFieldProps> {
  declare props: FileFieldProps;
  declare state: Field["state"] & FileFieldState;

  static override jsClass = "FileField";
  static override defaultProps: Partial<FileFieldProps> = {
    ...Field.defaultProps,
    multiple: false,
    format: "base64",
    zip: false,
  };

  private jsonRender?: JsonRender;

  private get fileInput(): HTMLInputElement | null {
    return this.input.current as HTMLInputElement | null;
  }

  constructor(props: FileFieldProps) {
    super(props);
    if (props.hidden) {
      this.state = {
        ...this.state,
        localClasses: "cursor-pointer",
      };
    }
    if (props.mutations) {
      const { mutations, ...propsSub } = props as FileFieldProps & Record<string, any>;
      this.jsonRender = new JsonRender(propsSub, mutations);
    }
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
  }

  override get componentProps(): Record<string, unknown> | undefined {
    const base = super.componentProps || {};
    return {
      ...base,
      onDragEnter: this.onDragEnter,
      onDragLeave: this.onDragLeave,
      onDrop: this.onDrop,
      onDragOver: this.onDragOver,
    };
  }

  private onDragOver(e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses("drag-over");
  }

  private onDragEnter(e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    this.addClasses("drag-over");
  }

  private onDragLeave(e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses("drag-over");
  }

  private onDrop(e: React.DragEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    this.deleteClasses("drag-over");
    const dt = e.dataTransfer;
    const input = this.fileInput;
    if (!dt || !input) return;
    const { files } = dt;
    input.files = files;
    this.onChange({
      target: input,
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  }

  override get type(): string {
    return "file";
  }

  override isInvalid(value: any): boolean {
    const input = this.fileInput;
    if (this.props.maxSize && input?.files) {
      const files = Array.from(input.files);
      const error = files.some(
        (file) => file.size > bytes(this.props.maxSize as string | number, { unit: "B" })
      );
      if (error) {
        const message =
          typeof this.props.errorMessage === "string"
            ? this.props.errorMessage
            : this.extractString(this.props.errorMessage as React.ReactNode);
        input.setCustomValidity(message);
        return true;
      }
    }
    return super.isInvalid(value);
  }

  override async onChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const { value, files } = e.target;
    const filesArray = Array.from(files ?? []) as File[];
    const nextValue: FileFieldStoredValue[] = [];
    const error = this.isInvalid(value);
    this.setState({
      value: nextValue,
      error,
    } as any);
    if (!filesArray.length || error) {
      this.returnData(null);
      return;
    }

    const responses = await Promise.all(
      filesArray.map(async (file) => {
        const readFile = await this.readAs(file, this.props.format);
        nextValue.push({
          name: file.name,
          file: readFile,
        });
        return readFile;
      })
    );

    if (this.props.multiple) this.returnData(responses);
    else this.returnData(responses[0]);
  }

  private readAs(file: File, format: FileFieldFormat = "base64"): Promise<FileFieldReadResult> {
    if (!file) return Promise.resolve(null);
    if (format === "blob") return Promise.resolve(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      switch (format) {
        case "base64":
          reader.readAsDataURL(file);
          break;
        case "text":
          reader.readAsText(file);
          break;
        case "binaryString":
          reader.readAsBinaryString(file);
          break;
        case "zip":
        case "arrayBuffer":
          reader.readAsArrayBuffer(file);
          break;
        default:
          reader.readAsDataURL(file);
          break;
      }

      const onFinish = (result: Uint8Array | number[] | null, error?: unknown) => {
        eventHandler.dispatch(`zipping.${this.props.name}`, {
          [this.props.name]: "end",
        });
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      };

      const onPercentage = (percentage: number | string) =>
        eventHandler.dispatch(`zipping.${this.props.name}`, {
          [this.props.name]: percentage,
        });

      reader.onload = () => {
        if (format !== "zip") {
          resolve(reader.result as string | ArrayBuffer);
          return;
        }
        eventHandler.dispatch(`zipping.${this.props.name}`, {
          [this.props.name]: "start",
        });
        const result = reader.result;
        if (!(result instanceof ArrayBuffer)) {
          resolve(null);
          return;
        }
        const array = new Uint8Array(result);
        const mode = (this.props.zip as number) || 9;
        const LZMA = (LZMAObj as { LZMA: any }).LZMA;
        LZMA.compress(array, mode, onFinish, onPercentage);
      };

      reader.onerror = (error) => reject(error);
    });
  }

  override get inputProps(): Record<string, any> {
    const inputProps = { ...super.inputProps };
    const hasValue = Array.isArray(this.state.value)
      ? this.state.value.length > 0
      : Boolean(this.state.value);
    inputProps.required = Boolean(inputProps.required) && !hasValue;
    delete inputProps.value;
    return inputProps;
  }

  override get inputNode(): React.ReactNode {
    const { inline, disabled, readOnly } = this.props;
    const { value } = this.state;
    const list = (Array.isArray(value) ? value : [value]).map((entry, index) => {
      if (!entry) return false;
      if (typeof entry === "string") {
        const nameFile = entry.split(/[\\/]/).pop()?.split("?")[0] || entry;
        return React.createElement(
          "a",
          {
            key: index,
            href: entry,
            target: "_blank",
            rel: "noreferrer",
            className: "",
          },
          nameFile
        );
      }
      if (this.jsonRender) {
        return this.jsonRender.buildContent({
          name: `${this.props.name}.file.${index}`,
          tag: "span",
          value: entry,
          content: entry.name,
        });
      }
      return React.createElement(
        "span",
        {
          key: index,
          name: entry.name,
          classes: "",
        },
        entry.name
      );
    });
    const links = list.filter(Boolean) as React.ReactNode[];

    const inputNode = React.createElement(
      React.Fragment,
      {},
      !(value && (disabled || readOnly))
        ? React.createElement("input", { ...this.inputProps })
        : React.createElement(
            "p",
            { className: "form-control mb-1 disabled" },
            ...links
          ),
      value &&
        !(disabled || readOnly) &&
        React.createElement(
          "p",
          { className: "text-end my-1" },
          React.createElement("small", {}, ...links)
        )
    );

    return inline
      ? React.createElement("div", { className: "col-auto" }, inputNode)
      : inputNode;
  }
}
