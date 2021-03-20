import React, { useEffect } from "react";
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import Field from "../../src/js/forms/fields/field";

export default {
  title: 'React Components/Fields/Field',
  component: Field,
  argTypes: {
    autoComplete: { control: 'text' },
    checkValidity: { disable: true },
    controlClasses: { control: 'text' },
    default: { control: 'text' },
    disabled: { control: 'boolean' },
    errorMessage: { control: 'text' },
    first: { control: { type: 'inline-radio', options: ['label', 'control'] } },
    inline: { control: 'boolean' },
    inlineLabelClasses: { control: 'text' },
    label: { control: 'text' },
    labelClasses: { control: 'text' },
    max: { control: 'number' },
    min: { control: 'number' },
    noValidate: { control: 'boolean' },
    pattern: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    step: { control: 'text' },
    type: { control: 'text' },
    value: { control: 'text' }
  }
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('name-Field pass-Field email-Field', action('onChange'));
  }, []);
  /*  useEffect(() => {
     eventHandler.unsubscribe('name-Field pass-Field email-Field');
   }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e); }}>
    <Field {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar error</button>
  </form>
};

export const TextFieldLabel = Template.bind({});
TextFieldLabel.args = {
  placeholder: 'Nombre',
  label: 'Nombre',
  name: 'name',
  value: 'Jonathan'
};

export const TextFieldPlaceholder = Template.bind({});
TextFieldPlaceholder.args = {
  placeholder: 'Nombre',
  name: 'name_placeholder'
};

export const TextFieldPassword = Template.bind({});
TextFieldPassword.args = {
  type: 'password',
  required: true,
  pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
  placeholder: 'Contraseña',
  name: 'pass',
  errorMessage: "La contraseña debe tener almenos 8 caracteres una mayúscula y un número."
};

export const TextFieldPattern = Template.bind({});
TextFieldPattern.args = {
  type: 'email',
  required: true,
  placeholder: 'Correo',
  name: 'email',
  errorMessage: "Coloca un correo válido."
};