import React from "react";
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import HiddenField from "../../src/js/forms/fields/hidden-field";

export default {
  title: 'React Components/Fields/HiddenField',
  component: HiddenField,
  argTypes: {
    name: { control: 'text' },
    default: { control: 'text' },
    value: { control: 'text' }
  }
};

const Template = (args) => {
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e.target[0].value); }}>
    <HiddenField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar</button>
  </form>
};

export const hideValue = Template.bind({});
hideValue.args = {
  name: 'name',
  value: 'Jonathan'
};
