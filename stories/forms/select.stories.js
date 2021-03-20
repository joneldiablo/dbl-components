import React, { useEffect } from 'react';
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import SelectField from "../../src/js/forms/fields/select-field";

export default {
  title: 'React Components/Fields/SelectField',
  component: SelectField
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('option-SelectField', action('onChange'));
  }, []);
  /* useEffect(() => {
    eventHandler.unsubscribe('option-SelectField');
  }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target); }}>
    <SelectField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
};

export const SelectFieldLabel = Template.bind({});
SelectFieldLabel.args = {
  placeholder: 'Selecciona una opción',
  name: 'option',
  label: null,
  value: null,
  required: false,
  options: [
    { label: "opcion 1", value: 1 },
    { label: "opcion 2", value: 2 }
  ],
  errorMessage: 'Debes seleccionar una opción'
};