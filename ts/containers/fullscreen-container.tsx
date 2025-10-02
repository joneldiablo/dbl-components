import React from "react";

export interface FullscreenContainerProps {
  children?: React.ReactNode;
  className?: string | string[];
  gutter?: string | number | null;
  overflow?: string;
  style?: React.CSSProperties;
}

export default class FullscreenContainer extends React.Component<FullscreenContainerProps> {
  static jsClass = "FullscreenContainer";
  static defaultProps: Partial<FullscreenContainerProps> = {
    className: "",
    gutter: null,
    overflow: "hidden",
    style: {},
  };

  override render(): React.ReactNode {
    const { className, style, overflow, children, gutter } = this.props;
    const classList = [
      FullscreenContainer.jsClass,
      ...(Array.isArray(className) ? className : [className ?? ""]),
    ]
      .flat()
      .filter(Boolean)
      .join(" ");

    const computedStyle: React.CSSProperties = {
      overflow,
      height:
        gutter !== null && gutter !== undefined
          ? `calc(100vh - ${gutter}px)`
          : "100vh",
      ...(style ?? {}),
    };

    return (
      <div className={classList} style={computedStyle}>
        {children}
      </div>
    );
  }
}
