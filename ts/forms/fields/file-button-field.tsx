import React from "react";

import DropFileField, { type DropFileFieldProps } from "./drop-file-field";

/**
 * File selector rendered as a button that keeps the drag & drop capabilities of
 * {@link DropFileField}.
 *
 * @example
 * ```tsx
 * <FileButtonField name="resume" label="Attach resume">
 *   <React.Fragment>
 *     <span>Select file</span>
 *     <span>Replace file</span>
 *   </React.Fragment>
 * </FileButtonField>
 * ```
 */
export default class FileButtonField extends DropFileField {
  declare props: DropFileFieldProps;
  declare state: DropFileField["state"];

  static override jsClass = "FileButtonField";
  static override defaultProps: Partial<DropFileFieldProps> = {
    ...DropFileField.defaultProps,
    labelClasses: "mb-0",
  };

  override tag: React.ElementType = "span";

  constructor(props: DropFileFieldProps) {
    super(props);
    this.state = {
      ...this.state,
      localClasses: "btn position-relative",
    };
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { value } = this.state;
    const childrenArray = React.Children.toArray(children as React.ReactNode);
    let node: React.ReactNode = null;
    if (childrenArray.length) {
      const [first, second] = childrenArray;
      node = value ? second ?? first ?? null : first ?? second ?? null;
    }

    return React.createElement(
      React.Fragment,
      {},
      this.labelNode,
      node,
      this.inputNode
    );
  }

  override render(): React.ReactElement | null {
    return React.createElement(
      React.Fragment,
      {},
      super.render(),
      this.errorMessageNode
    );
  }
}
