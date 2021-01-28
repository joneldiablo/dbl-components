import Field from "../../src/js/forms/fields/field";

export default {
  title: 'Forms/Fields',
  component: Field,
  argTypes: {
    type: 'text',
  },
};

const Template = (args) => <Field {...args} />;

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
  name: 'name',
  value: 'Jonathan'
};