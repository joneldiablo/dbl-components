import React, { useEffect } from 'react';
import { action } from '@storybook/addon-actions';
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import CheckboxField from "../../src/js/forms/fields/checkbox-field";

export default {
  title: 'React Components/Fields/CheckboxField',
  component: CheckboxField,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('opt-CheckboxField slow-CheckboxField number-CheckboxField', action('onChange'));
  }, []);
  /* useEffect(() => {
      eventHandler.unsubscribe('opt-CheckboxField slow-CheckboxField number-CheckboxField');
    }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target); }}>
    <CheckboxField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
}

export const checkboxStringValue = Template.bind({});
checkboxStringValue.args = {
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

export const checkboxUniqueValue = Template.bind({});
checkboxUniqueValue.args = {
  label: 'Seleccione si es lento',
  name: 'slow',
  required: true,
  inline: true,
  errorMessage: 'Es indispensable esta opción'
};

export const checkboxNumberValue = Template.bind({});
checkboxNumberValue.args = {
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