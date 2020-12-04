import React from "react";
import deepMerge from "../functions/deep-merge";
import SL from "./select-language";

const dictionary = {
  'es_MX': {},
  'en_US': {}
};

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
    let dic = (context && dictionary[this.lang]['_' + context]) || dictionary[this.lang];
    return (dic && dic[value]) || value;
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

  constructor() {

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

  src(s, context) {
    return (<Source value={s} context={context} />);
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