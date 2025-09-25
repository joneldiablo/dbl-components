import { eventHandler, resolveRefs, deepMerge } from "dbl-utils";
import JsonRender from "./json-render";
import Component, { ComponentProps, ComponentState } from "./component";
import React from "react";

export interface JsonRenderComponentProps extends ComponentProps {
  view?: Record<string, unknown> | null;
  childrenIn?: boolean | string;
  definitions?: Record<string, unknown>;
}

export interface JsonRenderComponentState extends ComponentState {
  [key: string]: unknown;
}

export default class JsonRenderComponent extends Component<JsonRenderComponentProps> {
  state: JsonRenderComponentState = {
    localClasses: "",
    localStyles: {},
  };
  static jsClass = "JsonRenderComponent";
  static template = {
    view: {},
    definitions: {},
  };

  static defaultProps: Partial<JsonRenderComponentProps> = {
    ...Component.defaultProps,
    view: null,
    childrenIn: false,
    definitions: {},
  };

  events: Array<[string, (...args: unknown[]) => void]> = [];

  jsonRender: JsonRender;
  templateSolved?: unknown;

  constructor(props: JsonRenderComponentProps) {
    super(props);
    Object.assign(this.state, {});
    this.jsonRender = new JsonRender(
      this.fixedProps,
      this.mutations.bind(this)
    );
    this.jsonRender.childrenIn = this.childrenIn;
  }

  get fixedProps(): JsonRenderComponentProps {
    return this.props;
  }

  get childrenIn(): boolean {
    return false;
  }

  get theView(): unknown {
    return (this.constructor as typeof JsonRenderComponent).template.view;
  }

  componentDidMount(): void {
    this.events.forEach(([evtName, callback]) =>
      eventHandler.subscribe(evtName, callback, this.name)
    );
    this.evalTemplate();
  }

  evalTemplate(): void {
    const definitions = deepMerge(
      (this.constructor as typeof JsonRenderComponent).template.definitions || {},
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
    this.events.forEach(([eName]) =>
      eventHandler.unsubscribe(eName, this.name)
    );
  }

  mutations(sectionName: string, section: unknown): unknown {
    return this.state[sectionName];
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const builded = this.jsonRender.buildContent(this.templateSolved);
    return this.props.childrenIn !== undefined && !this.props.childrenIn
      ? [builded, children]
      : builded;
  }
}
