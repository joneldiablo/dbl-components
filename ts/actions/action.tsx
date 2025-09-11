import React from "react";
import { resolveRefs, eventHandler } from "dbl-utils";

import Component, { ComponentProps } from "../component";
import JsonRender from "../json-render";

export interface ActionProps extends ComponentProps {
  classButton?: boolean;
  close?: string | boolean;
  disabled?: boolean;
  form?: string;
  icon?: string | boolean;
  iconClasses?: string | string[];
  iconProps?: Record<string, unknown>;
  id?: string | number;
  open?: string | boolean;
  status?: string | boolean;
  statusClasses?: Record<string, string | string[]>;
  statusIcons?: Record<string, string>;
  to?: string;
  type?: string;
  value?: unknown;
  justifyContent?: "start" | "center" | "end";
  navigate?: (
    to: number | { pathname: string; search?: string; hash?: string },
    options?: Record<string, unknown>
  ) => void;
  search?: string;
  hash?: string;
  navOptions?: Record<string, unknown>;
}

export default class Action extends Component<ActionProps> {
  static jsClass = "Action";
  static defaultProps: Partial<ActionProps> = {
    ...Component.defaultProps,
    type: "button",
    classButton: true,
    open: false,
    close: false,
    statusIcons: {
      success: "check",
      error: "x",
      warning: "exclamation",
      loading: "spinner",
    },
    statusClasses: {
      success: "text-bold text-success",
      error: "text-bold text-danger",
      warning: "text-bold text-warning",
      loading: "spinner",
    },
    iconClasses: "",
    iconProps: {},
    justifyContent: "center",
  };
  static schemaContent = {
    actionIcon: {
      name: ["$props/name", "actionIcon"],
      component: "Icons",
      icon: "$props/icon",
      style: {
        width: "var(--bs-btn-font-size)",
      },
    },
    actionContent: {
      name: ["$props/name", "actionContent"],
      tag: "span",
    },
    actionStatus: {
      name: ["$props/name", "actionStatus"],
      component: "Icons",
      icon: "$state/status",
      classes: "float-end",
    },
  };

  tag: React.ElementType = "button";
  classes = "d-inline-flex align-items-center";
  jsonRender: JsonRender;
  schema: any;

  constructor(props: ActionProps) {
    super(props);
    this.classes += " justify-content-" + props.justifyContent;
    this.state.localClasses = props.classButton ? "btn" : "";
    this.onClick = this.onClick.bind(this);
    this.eventHandlers.onClick = this.onClick;
    this.schema = resolveRefs(Action.schemaContent, { props });
    this.jsonRender = new JsonRender({ ...props }, this.mutations.bind(this));
  }

  onClick(e: React.SyntheticEvent<HTMLElement>) {
    e.stopPropagation();
    const {
      navigate,
      to,
      search,
      hash,
      type,
      open,
      close,
      value,
      name,
      id,
      navOptions = {},
    } = this.props;

    if (type === "link" && to && navigate) {
      if (typeof to === "number") navigate(to);
      else {
        navigate(
          {
            pathname: to,
            search,
            hash,
          },
          {
            ...navOptions,
            state: { name, id, value },
          }
        );
      }
    }

    if (open) {
      eventHandler.dispatch("update." + open, { open: true });
    }
    if (close) {
      eventHandler.dispatch("update." + close, { open: false });
    }

    let dispatch: string | Record<string, unknown> = name;
    if (value !== undefined || id !== undefined) {
      dispatch = { [name]: value, id };
    }
    eventHandler.dispatch(name, dispatch);
  }

  get componentProps() {
    const { type: prevType, disabled, form, _props = {} } = this.props;
    const type = prevType === "link" ? "button" : prevType;
    return { type, disabled, ..._props, form: form ? form + "-form" : undefined };
  }

  content() {
    return this.jsonRender.buildContent(this.schema);
  }

  mutations(name: string, config: Record<string, any>) {
    const search = name.replace(this.props.name + "-", "");
    switch (search) {
      case "actionIcon": {
        const cn: string[] = [];
        if (this.props.children) cn.push("me-2");
        return {
          ...this.props.iconProps,
          active: !!this.props.icon,
          icon: this.props.icon,
          classes: [cn, this.props.iconClasses].flat().filter(Boolean).join(" "),
        };
      }
      case "actionStatus": {
        const classes = [
          config.classes,
          this.props.statusClasses?.[this.props.status as string],
        ];
        if (this.props.icon || this.props.children) classes.push("ms-2");
        return {
          active: !!this.props.status,
          icon: this.props.statusIcons?.[this.props.status as string],
          classes,
        };
      }
      case "actionContent": {
        return {
          active: !!this.props.children,
          content: this.props.children,
        };
      }
      default:
        return undefined;
    }
  }
}

