import Field from "./field";
import RadioField from "./radio-field";
import NewPasswordField from "./new-password-field";
import CheckboxField from "./checkbox-field";
import HiddenField from "./hidden-field";
import SelectField from "./select-field";
import AutocompleteField from "./autocomplete-field";
import DateRangeField from "./date-range-field";
import Group from "../groups/group";
import GridGroup from "../groups/grid-group";

const fieldComponents = {
  Field,
  SelectField,
  RadioField,
  CheckboxField,
  NewPasswordField,
  AutocompleteField,
  DateRangeField,
  checkbox: CheckboxField,
  radio: RadioField,
  hidden: HiddenField,
  select: SelectField,
  Group,
  GridGroup
};

export default fieldComponents;
export const addFields = (_components) => {
  Object.assign(fieldComponents, _components);
}