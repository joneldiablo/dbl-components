import React, { useEffect } from 'react';
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import RadioField from "../../src/js/forms/fields/radio-field";

export default {
  title: 'React Components/Fields/RadioField',
  component: RadioField
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('opt-RadioField slow-RadioField number-RadioField', action('onChange'));
  }, []);
  /* useEffect(() => {
    eventHandler.unsubscribe('opt-RadioField slow-RadioField number-RadioField');
  }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target); }}>
    <RadioField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
};

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