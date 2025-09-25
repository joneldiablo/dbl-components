import React from "react";
import { deepMerge } from "dbl-utils";

import SelectLanguage from "./select-language";

const dictionary: Record<string, Record<string, any>> = {
  es_MX: {},
  en_US: {},
};

const translate = (
  value: string,
  context?: string | null,
  lang: string | null = localStorage.getItem("lang")
): string => {
  const dic = (context && dictionary[lang || "es_MX"]["_" + context]) || dictionary[lang || "es_MX"];
  return (dic && dic[value]) || value;
};

export interface TextProps {
  lang?: string | null;
  children?: React.ReactNode;
  value?: string;
  context?: string | null;
  code?: string;
}

interface TextState {
  value: string;
}

class Text extends React.Component<TextProps, TextState> {
  static defaultProps: Partial<TextProps> = {
    value: undefined,
    context: null,
    lang: null,
  };

  lang: string | null = localStorage.getItem("lang") || this.props.lang || null;

  state: TextState = {
    value: this.translate(),
  };

  translateEvent = (e: CustomEvent<string>): void => {
    this.lang = e.detail;
    localStorage.setItem("lang", this.lang as string);
    this.setState({ value: this.translate() });
  };

  componentDidMount(): void {
    document.addEventListener("translate", this.translateEvent as EventListener);
  }

  componentWillUnmount(): void {
    document.removeEventListener("translate", this.translateEvent as EventListener);
  }

  translate(): string {
    const { value, context } = this.props;
    return translate(value || "", context || undefined, this.lang);
  }

  render(): React.ReactNode {
    return this.state.value;
  }
}

class NumberText extends Text {}
class CurrencyText extends Text {}
class SourceText extends Text {}

class I18n {
  doReload = false;
  lang = localStorage.getItem("lang");

  reload = (): void => {
    location.reload();
  };

  plainText(obj: any, context?: string): string {
    if (typeof obj === "string") return translate(obj, context);
    if (Array.isArray(obj)) return obj.map((e) => this.plainText(e)).flat().join(" ");
    if (React.isValidElement(obj)) return this.plainText((obj as any).props.children);
    return obj.toString();
  }

  text(t: string, context?: string): React.ReactElement {
    return React.createElement(Text, { value: t, context });
  }

  number(n: number): React.ReactElement {
    return React.createElement(NumberText, { value: String(n) });
  }

  currency(c: number, code?: string): React.ReactElement {
    return React.createElement(CurrencyText, { value: String(c), code });
  }

  src = (s: string, context?: string): string => {
    if (!this.doReload) {
      this.doReload = true;
      document.addEventListener("translate", this.reload);
    }
    return translate(s, context, this.lang);
  };
}

const i18n = new I18n();

export const setDictionary = (d: Record<string, any>): void => {
  deepMerge(dictionary, d);
};

export const SelectLanguageComponent = SelectLanguage;
export const p = i18n.plainText.bind(i18n);
export const t = i18n.text.bind(i18n);
export const n = i18n.number.bind(i18n);
export const cur = i18n.currency.bind(i18n);
export const src = i18n.src;

export { SelectLanguageComponent as SelectLanguage };
