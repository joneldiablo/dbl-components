export { default as AutocompleteField } from "./fields/autocomplete-field";
export { default as CheckboxField } from "./fields/checkbox-field";
export { default as DateRangeField } from "./fields/date-range-field";
export { default as DropFileField } from "./fields/drop-file-field";
export { default as EditorField } from "./fields/editor-field";
export { default as Field } from "./fields/field";
export { default as FileButtonField } from "./fields/file-button-field";
export { default as FileField } from "./fields/file-field";
export { default as GroupField } from "./fields/group-field";
export { default as HiddenField } from "./fields/hidden-field";
export { default as JsonEditorField } from "./fields/json-editor-field";
export { default as NewPasswordField } from "./fields/new-password-field";
export { default as NoWrapField } from "./fields/no-wrap-field";
export { default as PaginationField } from "./fields/pagination-field";
export { default as RadioField } from "./fields/radio-field";
export { default as RangeField } from "./fields/range-field";
export { default as SelectField } from "./fields/select-field";
export { default as SwitchField } from "./fields/switch-field";
export { default as TextareaField } from "./fields/textarea-field";
export { default as groups } from "./groups";
export * from "./groups";

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

export const addFields = (_components) => {
  Object.assign(fieldComponents, _components);
}


export default fieldComponents;