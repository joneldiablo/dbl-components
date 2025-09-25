import React from "react";

import View, { ViewProps } from "./view";

export interface TitleViewProps extends ViewProps {
  label?: string;
  labelClasses?: string;
}

/**
 * View that prepends a heading element before its content.
 *
 * @example
 * ```tsx
 * <TitleView name="home" label="Welcome" />
 * ```
 */
export default class TitleView<P extends TitleViewProps = TitleViewProps> extends View {
  declare props: Readonly<P> & Readonly<{ children?: React.ReactNode }>;
  static jsClass = "TitleView";

  content(children = this.props.children): React.ReactNode {
    const { label, labelClasses } = this.props;
    return React.createElement(
      React.Fragment,
      {},
      React.createElement("h1", { className: labelClasses }, label),
      super.content(children)
    );
  }
}

