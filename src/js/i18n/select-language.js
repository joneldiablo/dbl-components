import React from "react";
import SelectField from "../forms/fields/select-field";

import mxSvg from "./flags/mx.svg";
import usSvg from "./flags/us.svg";

const flags = {
  es_MX: mxSvg,
  en_US: usSvg
};

const Flag = ({ value, children: label, flag }) => {
  return React.createElement('div', {},
    React.createElement('img',
      {
        src: flags[value] || flag,
        width: "30",
        style: { marginRight: 5, verticalAlign: 'text-top' }
      },
      label
    )
  );
}

export default class SelectLanguage extends SelectField {

  static jsClass = 'SelectLanguage';
  static defaultProps = {
    ...SelectField.defaultProps,
    variant: 'standard',
    value: null,
    ValueTemplate: Flag,
    fullWidth: false,
    options: [
      { value: 'es_MX', label: 'Español' },
      { value: 'en_US', label: 'English' }
    ]
  }

  imTheTrigger = false;

  constructor(props) {
    super(props);
    let lang = localStorage.getItem('lang');
    this.state.value = lang || props.value;
    if (!lang) localStorage.setItem('lang', props.value);
    this.onChange = this.onChange.bind(this);
  }

  translate = (e) => {
    if (!this.imTheTrigger) {
      super.onChange({ target: { value: e.detail } });
    }
    this.imTheTrigger = false;
  }

  componentDidMount() {
    document.addEventListener('translate', this.translate);
  }

  componentWillUnmount() {
    document.removeEventListener('translate', this.translate);
  }

  onChange(e) {
    super.onChange(e);
    let lang = e.target.value;
    localStorage.setItem('lang', lang);
    let event = new CustomEvent('translate', {
      detail: lang
    });
    this.imTheTrigger = true;
    document.dispatchEvent(event);
  }

  render() {
    return super.render();
  }

}