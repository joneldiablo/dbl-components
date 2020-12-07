import React from "react";
import SelectLanguage from "../src/js/i18n/select-language";
import { t, _, src, setDictionary } from "../src/js/i18n";

export default {
  title: 'Diablo components/I18N',
};

export const selectLanguage = () => {

  setDictionary({
    'es_MX': {

    },
    'en_US': {
      'Descripción del texto corto': 'Short text description.',
      'este es un texto corto': 'this is a short text',
      'https://dummyimage.com/600x400/000/fff': 'https://dummyimage.com/600x400/f0f0f0/000',
      'Cambio de imagen según el idioma': 'Change Image'
    }
  });

  return <div style={{ padding: 20 }}>
    <br />
    <SelectLanguage />
    <hr />
    <div title={_('Descripción del texto corto')}>{t('este es un texto corto')}</div>
    <hr />
    <div>{t('Cambio de imagen según el idioma')}:</div>
    <img src={src('https://dummyimage.com/600x400/000/fff')} />
  </div>
};

export const selectLanguageMultiple = () => {

  setDictionary({
    'es_MX': {

    },
    'en_US': {
      'texto corto': 'Short text',
      'diferente texto': 'Different to',
      'último texto': 'Last text',
    }
  });

  return <div style={{ padding: 20 }}>
    <br />
    <SelectLanguage />
    <div style={{ margin: 'auto', display: 'inline-block' }}>&nbsp;&nbsp;&nbsp;&nbsp;</div>
    <SelectLanguage />
    <hr />
    <div>{t('texto corto')}</div>
    <div>{t('diferente texto')}</div>
    <div>{t('último texto')}</div>
  </div>
};

