import Field from "./fields/field";
import RadioField from "./fields/radio-field";
import NewPasswordField from "./fields/new-password-field";
import CheckboxField from "./fields/checkbox-field";
import SwitchField from "./fields/switch-field";
import HiddenField from "./fields/hidden-field";
import SelectField from "./fields/select-field";
import AutocompleteField from "./fields/autocomplete-field";
import DateRangeField from "./fields/date-range-field";
import PaginationField from "./fields/pagination-field";
import groups from "./groups";
import FileButtonField from "./fields/file-button-field";

const fieldComponents = {
  Field,
  SelectField,
  RadioField,
  CheckboxField,
  SwitchField,
  NewPasswordField,
  AutocompleteField,
  DateRangeField,
  PaginationField,
  checkbox: CheckboxField,
  radio: RadioField,
  hidden: HiddenField,
  select: SelectField,
  FileButtonField,
  ...groups
};

export default fieldComponents;
export const addFields = (_components) => {
  Object.assign(fieldComponents, _components);
}