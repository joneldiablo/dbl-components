import React, { useEffect } from "react";
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import NewPasswordField from "../../src/js/forms/fields/new-password-field";

export default {
  title: 'React Components/Fields/NewPasswordField',
  component: NewPasswordField,
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
    labelRepeat: { control: 'text' },
    max: { control: 'number' },
    min: { control: 'number' },
    noValidate: { control: 'boolean' },
    pattern: { control: 'text' },
    placeholderRepeat: { control: 'text' },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    step: { control: 'text' },
    value: { control: 'text' }
  }
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('password-NewPasswordField', action('onChange'));
  }, []);
  /* useEffect(() => {
    eventHandler.unsubscribe('password-NewPasswordField');
  }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target[0].value); }}>
    <NewPasswordField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
};

export const hideValue = Template.bind({});
hideValue.args = {
  name: 'password',
  placeholder: '********',
  placeholderRepeat: '********',
  label: 'Password',
  labelRepeat: 'Password again',
  required: true,
  inline: true,
  inlineLabelClasses: 'col-md-2',
  pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$",
  errorMessage: "La contraseña debe tener almenos 8 caracteres una mayúscula y un número.",
  errorMessageRepeat: "La contraseña debe coincidir"
};
