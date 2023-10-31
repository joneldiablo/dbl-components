import AutocompleteField from "./fields/autocomplete-field";
import CheckboxField from "./fields/checkbox-field";
import DateRangeField from "./fields/date-range-field";
import DropFileField from "./fields/drop-file-field";
import EditorField from "./fields/editor-field";
import Field from "./fields/field";
import FileButtonField from "./fields/file-button-field";
import FileField from "./fields/file-field";
import GroupField from "./fields/group-field";
import HiddenField from "./fields/hidden-field";
import JsonEditorField from "./fields/json-editor-field";
import NewPasswordField from "./fields/new-password-field";
import NoWrapField from "./fields/no-wrap-field";
import PaginationField from "./fields/pagination-field";
import RadioField from "./fields/radio-field";
import RangeField from "./fields/range-field";
import SelectField from "./fields/select-field";
import SwitchField from "./fields/switch-field";
import TextareaField from "./fields/textarea-field";
import groups from "./groups";

const fieldComponents = {
  AutocompleteField,
  checkbox: CheckboxField,
  CheckboxField,
  DateRangeField,
  DropFileField,
  EditorField,
  Field,
  FileButtonField,
  FileField,
  GroupField,
  hidden: HiddenField,
  JsonEditorField,
  NewPasswordField,
  NoWrapField,
  PaginationField,
  radio: RadioField,
  RadioField,
  RangeField,
  select: SelectField,
  SelectField,
  SwitchField,
  TextareaField,
  ...groups
};

export default fieldComponents;
export const addFields = (_components) => {
  Object.assign(fieldComponents, _components);
}