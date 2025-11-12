import React from "react";

import SelectField, { SelectFieldProps } from "../forms/fields/select-field";

import mxSvg from "./flags/mx.svg";
import usSvg from "./flags/us.svg";

const flags: Record<string, string> = {
  es_MX: mxSvg,
  en_US: usSvg,
};

interface FlagProps {
  value: string;
  children?: React.ReactNode;
  flag?: string;
}

const Flag: React.FC<FlagProps> = ({ value, children: label, flag }) => (
  React.createElement(
    "div",
    {},
    React.createElement("img", {
      src: flags[value] || flag,
      width: "30",
      style: { marginRight: 5, verticalAlign: "text-top" },
    }),
    label
  )
);

export interface SelectLanguageProps extends SelectFieldProps {
  ValueTemplate?: React.ComponentType<FlagProps>;
  fullWidth?: boolean;
  variant?: string;
}

export default class SelectLanguage extends SelectField<SelectLanguageProps> {
  static jsClass = "SelectLanguage";
  static defaultProps: Partial<SelectLanguageProps> = {
    ...SelectField.defaultProps,
    variant: "standard",
    value: null,
    ValueTemplate: Flag,
    fullWidth: false,
    options: [
      { value: "es_MX", label: "Español" },
      { value: "en_US", label: "English" },
    ],
  };

  imTheTrigger = false;

  constructor(props: SelectLanguageProps) {
    super(props);
    const lang = localStorage.getItem("lang");
    this.state.value = (lang || props.value) as any;
    if (!lang) localStorage.setItem("lang", props.value as any);
    this.onChange = this.onChange.bind(this);
  }

  translate = (e: CustomEvent<string>): void => {
    if (!this.imTheTrigger) {
      super.onChange({ target: { value: e.detail } } as any);
    }
    this.imTheTrigger = false;
  };

  componentDidMount(): void {
    document.addEventListener("translate", this.translate as EventListener);
  }

  componentWillUnmount(): void {
    document.removeEventListener("translate", this.translate as EventListener);
  }

  onChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    super.onChange(e);
    const lang = e.target.value;
    localStorage.setItem("lang", lang);
    const event = new CustomEvent("translate", { detail: lang });
    this.imTheTrigger = true;
    document.dispatchEvent(event);
  }
}
