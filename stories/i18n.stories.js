import React from "react";
import SelectLanguage from "../src/js/i18n/select-language";
import { t, setDictionary } from "../src/js/i18n";

export default {
  title: 'Diablo components/I18N',
};

export const selectLanguage = () => {

  setDictionary({
    'es_MX': {
      
    },
    'en_US': {
      'texto corto': 'short text'
    }
  });

  return <div style={{ padding: 20 }}>
    <br />
    <SelectLanguage />
    <hr />
    <div>{t('texto corto')}</div>
  </div>
};

