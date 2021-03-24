import React, { useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import AutocompleteField from "../../src/js/forms/fields/autocomplete-field";
import countries from "./countries";

export default {
  title: 'React Components/Fields/AutocompleteField',
  component: AutocompleteField
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe(
      'countries-AutocompleteField countries_by_code-AutocompleteField',
      action('onChange')
    );
    if (args.name === 'countries_by_code') {
      const setOpts = (search) => {
        setTimeout(() => {
          const options = !search ? countries :
            countries.filter(opt =>
              opt.label.toLowerCase().includes(search.toLowerCase())
            );
          eventHandler.dispatch('update.countries_by_code-AutocompleteField', {
            more: !!options.slice(6).length,
            options: options.slice(0, 6)
          });
        }, 1000);
      }
      setOpts();
      eventHandler.subscribe('filter.countries_by_code-AutocompleteField', setOpts);
    }
  }, []);
  /* useEffect(() => {
      eventHandler.unsubscribe('countries-AutocompleteField countries_by_code-AutocompleteField');
    }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target); }}>
    <AutocompleteField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
}

export const withOptions = Template.bind({});
withOptions.args = {
  placeholder: 'Paises',
  name: 'countries',
  required: true,
  options: countries
}

export const withoutOptions = Template.bind({});
withoutOptions.args = {
  placeholder: 'Paises (por código)',
  name: 'countries_by_code',
  required: true,
  loading: 'loading'
}