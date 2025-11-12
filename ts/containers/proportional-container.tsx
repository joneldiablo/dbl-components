import React from "react";

import Container, { ContainerProps } from "./container";

export interface ProportionalContainerProps extends ContainerProps {
  ratio?: string | number | Record<string, string | number>;
  overflow?: string;
  innerClasses?: string | string[];
}

export default class ProportionalContainer extends Container {
  declare props: ProportionalContainerProps;
  static jsClass = "ProportionalContainer";
  static defaultProps: Partial<ProportionalContainerProps> = {
    ...Container.defaultProps,
    ratio: "100%",
    overflow: "hidden",
    fullWidth: true,
  };

  classes = "position-relative";
  ratioResponsive?: string | number;

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;
    const { ratio, overflow, innerClasses } = this.props;
    this.ratioResponsive =
      typeof ratio === "object" ? ratio[this.breakpoint] : ratio;
    const paddingBottom =
      typeof this.ratioResponsive === "number"
        ? `${this.ratioResponsive * 100}%`
        : this.ratioResponsive;
    const st: React.CSSProperties = {
      overflow,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    };
    return (
      <>
        <div className="space" style={{ paddingBottom }} />
        <div
          className={["inner", innerClasses]
            .flat()
            .filter(Boolean)
            .join(" ")}
          style={st}
        >
          {children}
        </div>
      </>
    );
  }
}
