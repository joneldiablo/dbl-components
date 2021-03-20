import React, { useEffect } from "react";
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import DateRangeField from "../../src/js/forms/fields/date-range-field";

export default {
  title: 'React Components/Fields/DateRangeField',
  component: DateRangeField
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('created_at-DateRangeField', action('onChange'));
  }, []);
  /* useEffect(() => {
    eventHandler.unsubscribe('created_at-DateRangeField');
  }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target); }}>
    <DateRangeField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
};

export const defaultRange = Template.bind({});
defaultRange.args = {
  label: 'Periodo',
  placeholder: 'Periodo',
  name: 'created_at',
  inline: true,
  required: true,
  default: undefined,
  errorMessage: "Ingresa un perido de tiempo válido"
}