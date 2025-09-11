import React from "react";

import JsonRenderContainer, {
  JsonRenderContainerProps,
} from "../containers/json-render-container";

export interface ViewProps extends JsonRenderContainerProps {
  test?: boolean;
  content?: Record<string, unknown>;
  location?: { pathname?: string };
  routesIn?: boolean;
}

/**
 * Base view component built on top of {@link JsonRenderContainer}.
 *
 * @example
 * ```tsx
 * <View name="demo" content={{ component: "div" }} />
 * ```
 */
export default class View<P extends ViewProps = ViewProps> extends JsonRenderContainer {
  declare props: Readonly<P> & Readonly<{ children?: React.ReactNode }>;
  declare state: JsonRenderContainer["state"];
  static jsClass = "View";

  static defaultProps: Partial<ViewProps> = {
    ...JsonRenderContainer.defaultProps,
    test: false,
    content: {},
  };

  tag: React.ElementType = "article";
  events: [string, (...args: unknown[]) => void][] = [];

  constructor(props: P) {
    super(props);
    Object.assign(this.state, {
      localClasses: props.test ? "test-view-wrapper" : "",
    });
  }

  get fixedProps() {
    return {
      ...this.props,
      childrenIn: this.props.routesIn,
    } as P;
  }

  get childrenIn() {
    return this.props.routesIn;
  }

  get theView(): Record<string, unknown> {
    return (this.props.content || {}) as Record<string, unknown>;
  }

  componentDidUpdate(prevProps: P): void {
    super.componentDidUpdate(prevProps);

    const { test, location } = this.props;
    // Force re-render if the route (pathname) changed
    if (location?.pathname !== prevProps.location?.pathname) {
      this.forceUpdate();
    }

    if (prevProps.test !== test) {
      const localClasses = new Set(
        String(this.state.localClasses).split(" ")
      );
      if (test) {
        localClasses.add("test-view-wrapper");
      } else {
        localClasses.delete("test-view-wrapper");
      }
      this.setState({
        localClasses: Array.from(localClasses).join(" "),
      });
    }
  }
}

