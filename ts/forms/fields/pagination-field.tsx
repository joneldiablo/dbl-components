import React from "react";

import Field, { type FieldProps } from "./field";

export interface PaginationTexts {
  first?: string;
  previus?: string;
  next?: string;
  last?: string;
  pages?: string;
  goto?: string;
}

export interface PaginationFieldProps extends FieldProps {
  total: number;
  paginationClasses?: string | string[];
  texts?: PaginationTexts;
  firstBtn?: boolean;
  previusBtn?: boolean;
  nextBtn?: boolean;
  lastBtn?: boolean;
}

interface PaginationFieldState {
  total: number;
}

export default class PaginationField extends Field<PaginationFieldProps> {
  declare props: PaginationFieldProps;
  declare state: Field["state"] & PaginationFieldState;

  static override jsClass = "PaginationField";
  static override defaultProps: Partial<PaginationFieldProps> = {
    ...Field.defaultProps,
    total: 1,
    default: 1,
    firstBtn: true,
    previusBtn: true,
    nextBtn: true,
    lastBtn: true,
    texts: {
      first: "Primer página",
      previus: "Página Anterior",
      next: "Siguiente página",
      last: "Última página",
      pages: "Páginas",
      goto: "Ir a la página...",
    },
  };

  tag: React.ElementType = "nav";

  constructor(props: PaginationFieldProps) {
    super(props);
    this.state = {
      ...this.state,
      total: props.total,
    };
  }

  override onUpdate(update: { total?: number } & Record<string, any>): void {
    const { total, ...rest } = update;
    if (total) this.setState({ total });
    super.onUpdate(rest);
  }

  override get type(): string {
    return "number";
  }

  override get inputProps(): Record<string, any> {
    const props = { ...super.inputProps };
    props.className = "page-link border-end-0 text-end pe-0";
    props.style = {
      ...(props.style || {}),
      width: 58,
    };
    props.max = this.state.total;
    props.min = 1;
    return props;
  }

  private isFirst(): boolean {
    return Number(this.state.value) === 1;
  }

  private isLast(): boolean {
    return Number(this.state.value) === this.state.total;
  }

  private gotoPage(newPage: number | "first" | "last"): void {
    let value = parseInt(String(this.state.value), 10);
    switch (newPage) {
      case "first":
        value = 1;
        break;
      case "last":
        value = this.state.total;
        break;
      default:
        value += newPage;
        break;
    }
    this.setState({ value } as any, () => this.returnData());
  }

  override returnData(value: any = this.state.value): void {
    const { total } = this.state;
    let nextValue = Number(value);
    if (nextValue > total) nextValue = total;
    else if (nextValue < 1) nextValue = 1;
    super.returnData(nextValue);
  }

  override content(): React.ReactNode {
    const {
      paginationClasses,
      texts = {},
      firstBtn,
      previusBtn,
      nextBtn,
      lastBtn,
    } = this.props;
    const { total } = this.state;
    const classes = ["pagination", paginationClasses].flat().filter(Boolean).join(" ");
    const isFirst = this.isFirst();
    const isLast = this.isLast();
    return React.createElement(
      "ul",
      { className: classes },
      firstBtn &&
        React.createElement(
          "li",
          { className: `page-item${isFirst ? " disabled" : ""}`, title: texts.first },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isFirst,
              onClick: () => this.gotoPage("first"),
            },
            React.createElement("span", {}, "«")
          )
        ),
      previusBtn &&
        React.createElement(
          "li",
          { className: `page-item${isFirst ? " disabled" : ""}`, title: texts.previus },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isFirst,
              onClick: () => this.gotoPage(-1),
            },
            React.createElement("span", {}, "‹")
          )
        ),
      React.createElement(
        "li",
        { className: "page-item", title: texts.goto },
        this.inputNode
      ),
      React.createElement(
        "li",
        { className: "page-item" },
        React.createElement(
          "span",
          { className: "page-link border-start-0 border-end-0 px-1", style: { pointerEvents: "none" } },
          " /"
        )
      ),
      React.createElement(
        "li",
        {
          className: "page-item disabled",
          title: `${total} ${texts.pages ?? ""}`.trim(),
          style: {
            width: 58,
            "--bs-pagination-disabled-color": "var(--bs-pagination-color)",
            "--bs-pagination-disabled-bg": "var(--bs-pagination-bg)",
          },
        },
        React.createElement("span", { className: "page-link border-start-0" }, total)
      ),
      nextBtn &&
        React.createElement(
          "li",
          { className: `page-item${isLast ? " disabled" : ""}`, title: texts.next },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isLast,
              onClick: () => this.gotoPage(1),
            },
            React.createElement("span", {}, "›")
          )
        ),
      lastBtn &&
        React.createElement(
          "li",
          { className: `page-item${isLast ? " disabled" : ""}`, title: texts.last },
          React.createElement(
            "button",
            {
              type: "button",
              className: "page-link",
              disabled: isLast,
              onClick: () => this.gotoPage("last"),
            },
            React.createElement("span", {}, "»")
          )
        )
    );
  }
}
