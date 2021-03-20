import React, { useEffect, useState } from "react";
import { action } from '@storybook/addon-actions';

import eventHandler from "../../src/js/functions/event-handler";
import schemaManager from "../../src/js/functions/schema-manager";
import Form from "../../src/js/forms/form";

import suppliersSchema from "../assets/schemas/suppliers.json";

schemaManager.schema = suppliersSchema;

export default {
  title: 'React Components/Form',
  component: Form
};

const Template = (args) => {
  const [active, setActive] = useState(false);
  useEffect(() => {
    eventHandler.subscribe('form-Form', action('onSubmit'));
    eventHandler.subscribe('change.form-Form', action('onChange'));
    eventHandler.subscribe('valid.form-Form', e => { setActive(true); action('onValid')(e) });
    eventHandler.subscribe('invalid.form-Form', e => { setActive(false); action('onInvalid')(e) });
  }, []);
  return (<Form {...args} >
    <button className="btn btn-primary mb-3" type="submit" disabled={!active}>Enviar</button>
  </Form>);
}

export const formDefault = Template.bind({});
const schema = schemaManager.schema;
formDefault.args = {
  fields: schema.fields,
  name: 'form',
  clearAfterDone: schema.clearAfterDone
}

