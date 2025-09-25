import React from "react";
import { eventHandler } from "dbl-utils";

import Container, { ContainerProps } from "./container";
import { ComponentState } from "../component";

export interface TabsContainerProps extends ContainerProps {
  navClasses?: string | string[];
  tabClasses?: string | string[];
  containerClasses?: string | string[];
}

interface TabsContainerState {
  i: number;
  value?: string;
}

export default class TabsContainer extends Container {
  static jsClass = "TabsContainer";
  static defaultProps: Partial<TabsContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
  };

  declare props: TabsContainerProps;
  declare state: ComponentState & TabsContainerState;

  constructor(props: TabsContainerProps) {
    super(props);
    this.state = { ...(this.state as any), i: 0, value: "0" };
    this.onClickTab = this.onClickTab.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  componentDidMount(): void {
    super.componentDidMount();
    eventHandler.subscribe(`update.${this.props.name}`, this.onUpdate, this.name);
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    eventHandler.unsubscribe(`update.${this.props.name}`, this.name);
  }

  onUpdate({ active }: { active: string }): void {
    this.setState({ value: String(active), i: parseInt(active, 10) } as any);
  }

  onClickTab(e: React.MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const tabName = target.getAttribute("index");
    if (!tabName) return;
    this.setState({ value: tabName, i: parseInt(tabName, 10) } as any);
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: tabName });
  }

  get tabNode(): React.ReactNode {
    const { children = [], navClasses, tabClasses } = this.props;
    const { i: index } = this.state;
    const cn = ["nav", navClasses];
    const childArray = React.Children.toArray(children) as React.ReactElement[];
    return React.createElement(
      "nav",
      {},
      React.createElement(
        "div",
        { className: cn.flat().filter(Boolean).join(" ") },
        ...childArray
          .map((tab, i) => {
            if (!tab) return null;
            const t: any = tab;
            const base = !(t.props?.style && t.props.style["--component-name"])
              ? t
              : t.props.children;
            const { label, name, tabClasses: tabC } = (base?.props || {}) as any;
            const cnTab = ["nav-link"] as (string | string[])[];
            if (tabClasses) cnTab.push(tabClasses);
            if (tabC) cnTab.push(tabC);
            if (index === i) cnTab.push("active");
            return React.createElement(
              "span",
              {
                key: i,
                className: cnTab.flat().join(" "),
                index: String(i),
                name,
                onClick: this.onClickTab,
                style: { cursor: "pointer" },
              } as any,
              label
            );
          })
          .filter(Boolean) as React.ReactNode[]
      )
    );
  }

  get activeTabNode(): React.ReactNode {
    const { children = [], containerClasses } = this.props;
    const { i } = this.state;
    const childArray = React.Children.toArray(children) as React.ReactNode[];
    return React.createElement(
      "div",
      { className: containerClasses },
      childArray[i]
    );
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;
    return React.createElement(
      React.Fragment,
      {},
      this.tabNode,
      this.activeTabNode
    );
  }
}
