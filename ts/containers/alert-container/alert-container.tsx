import React from "react";

import Component, {
  nameSuffixes,
  type ComplexComponentProps,
  type ComplexComponentState,
} from "../../complex-component";

import schema from "./alert-schema.json";

interface AlertContainerClasses {
  "."?: string;
  label?: string;
  icon?: string;
  description?: string;
  close?: string;
}

export interface AlertContainerProps extends ComplexComponentProps {
  icon?: string;
  iconSize?: number;
  color?: string;
  showClose?: boolean;
  label?: React.ReactNode;
  content?: React.ReactNode;
  classes?: AlertContainerClasses;
}

export interface AlertContainerState extends ComplexComponentState {}

export default class AlertContainer extends Component<
  AlertContainerProps,
  AlertContainerState
> {
  static override jsClass = "AlertContainer";
  static override defaultProps: AlertContainerProps = {
    ...Component.defaultProps,
    schema,
    iconSize: 20,
    color: "primary",
    showClose: true,
    definitions: {},
    classes: {
      ".": "",
      label: "mb-0",
      icon: "",
      description: "",
      close: "",
    },
    rules: {
      ...nameSuffixes(["Label", "Description", "Close"]),
    },
  } as AlertContainerProps;
  static override dontBuildContent = true;
  static override wrapper: false | string = false;

  classes = "alert fade show shadow-sm";
  private setClasses = new Set<string>();

  constructor(props: AlertContainerProps) {
    super(props);
    this.state = {
      ...this.state,
      localClasses: this.buildClasses({} as AlertContainerProps),
    };
  }

  override componentDidUpdate(prevProps: Readonly<AlertContainerProps>): void {
    const classes = this.buildClasses(prevProps);
    if (classes !== this.state.localClasses) {
      this.setState({ localClasses: classes } as Partial<AlertContainerState>);
    }
  }

  private buildClasses(prevProps: Partial<AlertContainerProps>): string {
    if (prevProps.color !== this.props.color) {
      if (prevProps.color) this.setClasses.delete(`alert-${prevProps.color}`);
      if (this.props.color) this.setClasses.add(`alert-${this.props.color}`);
    }
    if (prevProps.showClose !== this.props.showClose) {
      if (this.props.showClose) this.setClasses.add("alert-dismissible");
      else this.setClasses.delete("alert-dismissible");
    }
    return Array.from(this.setClasses)
      .flat()
      .filter(Boolean)
      .join(" ");
  }

  override mutations(sn: string, section: any): any {
    const { name } = this.props;
    switch (sn) {
      case `${name}Label`:
        return {
          icon: this.props.icon,
          label: this.props.label,
          classes: {
            ".": `${this.props.classes?.label ?? ""} alert-heading`.trim(),
            icon: `${this.props.classes?.icon ?? ""} alert-icon align-text-middle`.trim(),
          },
        };
      case `${name}Description`:
        return {
          classes: `${this.props.classes?.description ?? ""}${this.props.icon ? " ps-4" : ""}`.trim(),
          content: this.props.content,
        };
      case `${name}Close`:
        return {
          active: this.props.showClose,
          classes: `${this.props.classes?.close ?? ""} btn-close`.trim(),
        };
      default:
        break;
    }
    return super.mutations(sn, section);
  }
}
