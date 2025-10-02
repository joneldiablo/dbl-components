import React from "react";

import Component, {
  type ComponentProps,
  type ComponentState,
} from "../component";

export interface FetchContainerProps extends ComponentProps {
  url: string;
  fetchProps?: RequestInit;
}

interface FetchContainerState extends ComponentState {
  fetchContent?: string;
}

export default class FetchContainer extends Component<
  FetchContainerProps,
  FetchContainerState
> {
  static override jsClass = "FetchContainer";

  state: FetchContainerState = {
    localClasses: "",
    localStyles: {},
    fetchContent: undefined,
  };

  override componentDidMount(): void {
    void this.fetchContent();
  }

  private async fetchContent(): Promise<void> {
    const { url, fetchProps } = this.props;
    const response = await fetch(url, fetchProps);
    const content = await response.text();
    this.setState({ fetchContent: content });
  }

  override content(
    children: React.ReactNode = this.props.children
  ): React.ReactNode {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{
            __html: this.state.fetchContent ?? "",
          }}
        />
        {children}
      </>
    );
  }
}
