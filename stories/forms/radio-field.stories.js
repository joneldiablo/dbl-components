import { action } from '@storybook/addon-actions';

import "bootstrap/scss/bootstrap.scss";
import RadioField from "../../src/js/forms/fields/radio-field";

export default {
  title: 'Forms/RadioField',
  component: RadioField,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

const Template = (args) => <form onSubmit={e => e.preventDefault()}>
  <ul>{Object.keys(args).map(arg => <li key={arg}>{arg}</li>)}</ul>
  <RadioField {...args} onChange={action('onChange')} />
  <button className="btn btn-primary" type="submit">Probar</button>
</form>;

export const radioStringValue = Template.bind({});
radioStringValue.args = {
  name: 'opt',
  label: 'Selecciona una opción',
  errorMessage: 'debes seleccionar una opción',
  required: true,
  inline: false,
  options: [
    {
      value: "opt1",
      label: "Opción 1"
    },
    {
      value: "opt2",
      label: "Opción 2"
    },
    {
      value: "opt3",
      label: "Opción 3"
    }
  ]
};

export const radioBooleanValue = Template.bind({});
radioBooleanValue.args = {
  label: '¿Eres lento?',
  name: 'slow',
  required: false,
  inline: true,
  errorMessage: 'Selecciona una opción',
  options: [
    {
      value: true,
      label: 'Sí'
    },
    {
      value: false,
      label: 'No'
    }
  ]
};

export const radioNumberValue = Template.bind({});
radioNumberValue.args = {
  label: 'Selecciona un número',
  name: 'number',
  required: true,
  inline: false,
  errorMessage: 'Selecciona una opción',
  options: [
    {
      value: 0,
      label: '0 opt'
    },
    {
      value: 1,
      label: '1 opt'
    },
    {
      value: 2,
      label: '2 opt'
    }
  ]
};