import React from "react";
import deepMerge from "../functions/deep-merge";
import SL from "./select-language";

const dictionary = {
  'es_MX': {},
  'en_US': {}
};

const translate = (value, context, lang) => {
  let dic = (context && dictionary[lang]['_' + context]) || dictionary[lang];
  return (dic && dic[value]) || value;
}

class Text extends React.Component {

  static defaultProps = {
    value: null,
    context: null,
    lang: null
  }

  lang = localStorage.getItem('lang') || this.props.lang;

  state = {
    value: this.translate()
  }

  componentDidMount() {
    document.addEventListener('translate', this.translateEvent);
  }

  componentWillUnmount() {
    document.removeEventListener('translate', this.translateEvent);
  }

  translateEvent = (e) => {
    this.lang = e.detail;
    this.setState({
      value: this.translate()
    });
  }

  translate() {
    let { value, context } = this.props;
    return translate(value, context, this.lang);
  }

  toString() {
    return this.state.value;
  }

  render() {
    return this.state.value;
  }

}

class Number extends Text {

}

class Currency extends Text {

}

class Source extends Text {

}

class I18n {

  doReload = false;
  lang = localStorage.getItem('lang');

  constructor() {

  }

  reload = () => {
    location.reload();
  }

  text(t, context) {
    return (<Text value={t} context={context} />);
  }

  number(n) {
    return (<Number value={n} />);
  }

  currency(c, code) {
    return (<Currency value={c} code={code} />);
  }

  src = (s, context) => {
    if (!this.doReload) {
      this.doReload = true;
      document.addEventListener('translate', this.reload);
    }
    return (translate(s, context, this.lang));
  }

}

const i18n = new I18n();

export const setDictionary = (d) => {
  deepMerge(dictionary, d);
}
export const SelectLanguage = SL;
export const t = i18n.text;
export const n = i18n.number;
export const cur = i18n.currency;
export const src = i18n.src;
export const _ = i18n.src;