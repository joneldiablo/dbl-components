import React from "react";

import Container, { type ContainerProps } from "./container";

export interface CardContainerProps extends ContainerProps {
  headerClasses?: string | string[];
  bodyClasses?: string | string[];
  footerClasses?: string | string[];
}

type CardSections = {
  header: React.ReactNode[];
  body: React.ReactNode[];
  footer: React.ReactNode[];
};

export default class CardContainer extends Container<CardContainerProps> {
  static override jsClass = "CardContainer";
  static override defaultProps: Partial<CardContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    headerClasses: "",
    bodyClasses: "",
    footerClasses: "",
  };

  classes = "card";

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;

    const sections: CardSections = {
      header: [],
      body: [],
      footer: [],
    };

    React.Children.forEach(children, (child) => {
      if (!child) return;
      if (!React.isValidElement(child)) {
        sections.body.push(child);
        return;
      }

      const targetElement =
        child.props?.style && child.props.style["--component-name"]
          ? child.props.children
          : child;

      const props = React.isValidElement(targetElement)
        ? targetElement.props ?? {}
        : {};

      if (props.header) sections.header.push(child);
      else if (props.footer) sections.footer.push(child);
      else if (props.container && sections[props.container as keyof CardSections])
        sections[props.container as keyof CardSections].push(child);
      else sections.body.push(child);
    });

    const buildClasses = (base: string, extra?: string | string[]) =>
      [base, extra]
        .flat()
        .filter(Boolean)
        .join(" ");

    const header = sections.header.length
      ? (
          <div className={buildClasses("card-header", this.props.headerClasses)}>
            {sections.header}
          </div>
        )
      : null;

    const footer = sections.footer.length
      ? (
          <div className={buildClasses("card-footer", this.props.footerClasses)}>
            {sections.footer}
          </div>
        )
      : null;

    return (
      <>
        {header}
        <div className={buildClasses("card-body", this.props.bodyClasses)}>
          {sections.body}
        </div>
        {footer}
      </>
    );
  }
}

