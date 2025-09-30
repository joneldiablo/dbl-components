import React from "react";
import "details-polyfill";

import { eventHandler } from "dbl-utils";

import Component, { type ComponentProps } from "../component";

export interface DetailsContainerProps extends ComponentProps {
  open?: boolean;
  containerClasses?: string | string[];
  labelClasses?: string | string[];
  label?: React.ReactNode;
  id?: string;
  data?: unknown;
}

interface DetailsContainerState {
  open: boolean;
}

export default class DetailsContainer extends Component<
  DetailsContainerProps,
  DetailsContainerState
> {
  static override jsClass = "DetailsContainer";
  static override defaultProps: Partial<DetailsContainerProps> = {
    ...Component.defaultProps,
    open: false,
  };

  override tag: React.ElementType = "details";
  private events: Array<[string, (...args: unknown[]) => void]> = [];

  constructor(props: DetailsContainerProps) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    Object.assign(this.eventHandlers, { onToggle: this.onEvent });
    this.events.push([`update.${props.name}`, this.onUpdate.bind(this)]);
    this.state = {
      ...this.state,
      open: !!props.open,
    };
  }

  override get componentProps(): Record<string, unknown> | undefined {
    return { open: this.state.open, ...this.props._props };
  }

  override componentDidMount(): void {
    const element = this.ref.current;
    if (element) {
      element.addEventListener("toggle", this.onToggle as EventListener);
    }
    this.events.forEach(([evt, cb]) => eventHandler.subscribe(evt, cb, this.name));
  }

  override componentWillUnmount(): void {
    const element = this.ref.current;
    if (element) {
      element.removeEventListener("toggle", this.onToggle as EventListener);
    }
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.name));
  }

  private onUpdate({ open }: { open?: boolean }): void {
    if (typeof open === "boolean") {
      this.setState({ open } as Partial<DetailsContainerState>);
    }
  }

  private onToggle(evt: any): void {
    const open = evt?.newState === "open";
    this.setState({ open } as Partial<DetailsContainerState>);
    eventHandler.dispatch(this.props.name, {
      [this.props.name]: evt?.newState,
      id: this.props.id,
      data: this.props.data,
    });
  }

  override content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { containerClasses, labelClasses, label } = this.props;
    const cnLabel = [labelClasses]
      .flat()
      .filter(Boolean)
      .join(" ");
    const cnContainer = [containerClasses]
      .flat()
      .filter(Boolean)
      .join(" ");
    return (
      <>
        <summary className={cnLabel}>{label}</summary>
        {this.state.open && <div className={cnContainer}>{children}</div>}
      </>
    );
  }
}
