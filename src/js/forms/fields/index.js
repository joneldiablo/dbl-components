import Field from "./field";
import RadioField from "./radio-field";
import NewPasswordField from "./new-password-field";
import CheckboxField from "./checkbox-field";
import HiddenField from "./hidden-field";
import SelectField from "./select-field";
import AutocompleteField from "./autocomplete-field";
import Group from "../groups/group";
import GridGroup from "../groups/grid-group";

const fieldComponents = {
  Field,
  SelectField,
  RadioField,
  CheckboxField,
  NewPasswordField,
  AutocompleteField,
  checkbox: CheckboxField,
  radio: RadioField,
  hidden: HiddenField,
  Group,
  GridGroup
};

export default fieldComponents;
export const addFields = (_components) => {
  Object.assign(fieldComponents, _components);
}