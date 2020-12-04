import React from "react";
import Select from "../forms/fields/material/select-field";

import mxSvg from "./flags/mx.svg";
import usSvg from "./flags/us.svg";

const flags = {
  es_MX: mxSvg,
  en_US: usSvg
};

const Flag = ({ value, children: label, flag }) => {
  return <div>
    <img src={flags[value] || flag} width="30" style={{ marginRight: 5, verticalAlign: 'text-top' }} />
    {label}
  </div>
}

const setLanguage = (e) => {
  let lang = e.target.value;
  localStorage.setItem('lang', lang);
  let event = new CustomEvent('translate', {
    detail: lang
  });
  document.dispatchEvent(event);
}

document.addEventListener('translate', e => {
  console.log(e.detail);
});

export default class SelectLanguage extends Select {

  static defaultProps = {
    ...Select.defaultProps,
    variant: 'standard',
    value: null,
    ValueTemplate: Flag,
    onChange: setLanguage,
    fullWidth: false,
    options: [
      { value: 'es_MX', label: 'Español' },
      { value: 'en_US', label: 'English' }
    ]
  }

  constructor(props) {
    super(props);
    let lang = localStorage.getItem('lang');
    this.state.value = lang || props.value;
    if (!lang) localStorage.setItem('lang', props.value);
  }

  render() {
    return super.render();
  }

}