import SelectField from "../../src/js/forms/fields/select-field";

export default {
  title: 'Forms/Select',
  component: SelectField,
  argTypes: {
    type: 'select',
  }
};

const Template = (args) => <SelectField {...args} />;

export const SelectFieldLabel = Template.bind({});
SelectFieldLabel.args = {
  placeholder: 'Selecciona una opción',
  name: 'option',
  label: null,
  value: null,
  options: [
    { label: "opcion 1", value: 1 },
    { label: "opcion 2", value: 2 }
  ]
};