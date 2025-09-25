import React from "react";
import { eventHandler, resolveRefs, deepMerge } from "dbl-utils";

import JsonRender from "../json-render";
import Container, { ContainerProps } from "./container";

export interface JsonRenderContainerProps extends ContainerProps {
  content?: string | unknown[] | Record<string, unknown>;
  view?: unknown;
  childrenIn?: boolean;
  definitions?: Record<string, unknown>;
}

/**
 * Container that builds its children from a JSON definition.
 *
 * @example
 * ```tsx
 * <JsonRenderContainer name="demo" view={{ component: "div" }} />
 * ```
 */
export default class JsonRenderContainer<
  P extends JsonRenderContainerProps = JsonRenderContainerProps
> extends Container {
  declare props: Readonly<P> & Readonly<{ children?: React.ReactNode }>;
  declare state: Container["state"];
  static jsClass = "JsonRenderContainer";
  static template = {
    view: {},
    definitions: {},
  };

  static defaultProps: Partial<JsonRenderContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    view: null,
    childrenIn: false,
    definitions: {},
  };

  tag: React.ElementType = "div";
  events: [string, (...args: unknown[]) => void][] = [];
  jsonRender: JsonRender;
  templateSolved?: unknown;

  constructor(props: P) {
    super(props);
    this.jsonRender = new JsonRender(
      this.fixedProps,
      this.mutations.bind(this)
    );
  }

  get fixedProps() {
    return this.props;
  }

  get childrenIn() {
    return this.props.childrenIn;
  }

  get theView() {
    return (this.constructor as typeof JsonRenderContainer).template.view;
  }

  componentDidMount(): void {
    super.componentDidMount();
    this.events.forEach(([evtName, callback]) =>
      eventHandler.subscribe(evtName, callback, this.name)
    );
    this.evalTemplate();
  }

  evalTemplate(): void {
    const definitions = deepMerge(
      (this.constructor as typeof JsonRenderContainer).template
        .definitions || {},
      this.props.definitions || {}
    );

    this.templateSolved = this.props.view
      ? resolveRefs(this.props.view, {
          template: this.theView,
          definitions,
          props: this.props,
          state: this.state,
        })
      : resolveRefs(this.theView, {
          definitions,
          props: this.props,
          state: this.state,
        });
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.events.forEach(([evtName]) =>
      eventHandler.unsubscribe(evtName, this.name)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mutations(sectionName: string, section: unknown): unknown {
    return (
      this.state as unknown as Record<string, unknown>
    )[sectionName];
  }

  content(children = this.props.children): React.ReactNode {
    if (!(this.breakpoint && this.templateSolved)) return this.waitBreakpoint;

    const builded = this.jsonRender.buildContent(this.templateSolved);
    return !this.childrenIn
      ? React.createElement(React.Fragment, {}, builded, children)
      : builded;
  }
}

