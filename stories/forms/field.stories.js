import "bootstrap/scss/bootstrap.scss";
import Field from "../../src/js/forms/fields/field";

export default {
  title: 'Forms/Fields',
  component: Field
};

const Template = (args) => <form onSubmit={e => e.preventDefault()}>
  <ul>{Object.keys(args).map(arg=><li key={arg}>{arg}</li>)}</ul>
  <Field {...args} />
  <button className="btn btn-primary" type="submit">Probar</button>
</form>;

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
  name: 'name'
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