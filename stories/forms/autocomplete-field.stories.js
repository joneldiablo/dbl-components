import { action } from '@storybook/addon-actions';
import "bootstrap/scss/bootstrap.scss";
import AutocompleteField from "../../src/js/forms/fields/autocomplete-field";
import countries from "./countries";

export default {
  title: 'Forms/Autocomplete field',
  component: AutocompleteField
};

const Template = (args) => <form onSubmit={(e) => { e.preventDefault(); action('onSubmit')(e) }}>
  <ul>{Object.keys(args).map(arg => <li key={arg}>{arg}</li>)}</ul>
  <AutocompleteField {...args} onChange={action('onChange')} />
  <br /><br />
  <button className="btn btn-primary" type="submit">Probar error</button>
</form>;

export const withoutFilter = Template.bind({});
withoutFilter.args = {
  placeholder: 'Paises',
  name: 'countries',
  options: countries
}

export const withFilter = Template.bind({});
withFilter.args = {
  placeholder: 'Paises (por código)',
  name: 'countries',
  onFilter: (val) => {
    return countries.filter(opt => opt.value.toLowerCase().includes(val.toLowerCase()));
  },
  options: countries
}