import React from "react";

import { resolveRefs, eventHandler } from "dbl-utils";

import JsonRender from "./json-render";
import Component, { type ComponentProps, type ComponentState } from "./component";

export const nameSuffixes = (sfxs: string[] = []): Record<string, any> => {
  return sfxs.reduce<Record<string, any>>((acum, item) => {
    acum["$name" + item] = ["join", ["$data/name", item], ""];
    return acum;
  }, {});
};

const schema = { view: { name: "$nameDummy", content: "Remplazar esto" }, definitions: {} };

export interface ComplexComponentProps extends ComponentProps {
  schema: any;
  definitions?: Record<string, unknown>;
  classes?: string | string[] | Record<string, string | undefined>;
  rules?: Record<string, unknown>;
  childrenIn?: boolean;
  [key: string]: any;
}

export interface ComplexComponentState extends ComponentState {
  view: any;
}

export default class ComplexComponent<P extends ComplexComponentProps = ComplexComponentProps> extends Component<P> {
  static jsClass = "Complex";
  static defaultProps = {
    ...Component.defaultProps,
    schema,
    definitions: {},
    classes: {
      ".": "",
    },
    rules: {},
  } as ComplexComponentProps;

  events: Array<[string, ...unknown[]]> = [];

  jsonRender: JsonRender;

  state: ComplexComponentState = {
    localClasses: "",
    localStyles: {},
    view: undefined,
  };

  constructor(props: P) {
    super(props);
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
    this.state = { ...this.state, view: this.buildView() };
  }

  componentDidMount(): void {
    this.events.forEach(([eventName, ...rest]) => {
      eventHandler.subscribe(eventName, ...(rest as unknown[]));
    });
  }

  componentWillUnmount(): void {
    this.events.forEach(([eventName]) => {
      eventHandler.unsubscribe(eventName);
    });
  }

  buildView(): any {
    const { schema, rules, definitions, ...all } = this.props as any;
    schema.data = all;
    Object.assign(schema.definitions, definitions);
    return resolveRefs(schema.view, schema, rules);
  }

  mutations(sn: string): any {
    return (this.state as any)[sn];
  }

  content(children = this.props.children): React.ReactNode {
    const { childrenIn } = this.props as any;
    const content = this.jsonRender.buildContent((this.state as any).view);
    return React.createElement(
      React.Fragment,
      {},
      content,
      !childrenIn && children,
    );
  }
}
