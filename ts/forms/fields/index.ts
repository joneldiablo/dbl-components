import React from "react";

import jsFieldComponents from "../../../src/js/forms/fields.js";

import Field from "./field";
import AutocompleteField from "./autocomplete-field";
import SelectField from "./select-field";
import RadioField from "./radio-field";
import CheckboxField from "./checkbox-field";
import SwitchField from "./switch-field";
import GroupField from "./group-field";
import HiddenField from "./hidden-field";
import NoWrapField from "./no-wrap-field";
import TextareaField from "./textarea-field";
import RangeField from "./range-field";
import DateRangeField from "./date-range-field";

/**
 * React component type enhanced with the optional legacy `jsClass` identifier.
 *
 * @example
 * const type: FieldComponentType = Field;
 */
export type FieldComponentType = React.ComponentType<any> & {
  jsClass?: string;
};

/**
 * Registry mapping field names to their implementations.
 *
 * @example
 * const registry: FieldComponentRegistry = { Field };
 */
export type FieldComponentRegistry = Record<string, FieldComponentType>;

/**
 * Combined registry bridging legacy JavaScript field implementations with typed counterparts.
 *
 * @example
 * const FieldComponent = fieldComponents["Field"];
 */
const fieldComponents: FieldComponentRegistry = {
  ...jsFieldComponents,
  AutocompleteField,
  Field,
  SelectField,
  radio: RadioField,
  RadioField,
  CheckboxField,
  checkbox: CheckboxField,
  SwitchField,
  GroupField,
  HiddenField,
  hidden: HiddenField,
  NoWrapField,
  TextareaField,
  RangeField,
  DateRangeField,
};

/**
 * Register new field components that can be consumed by forms and groups.
 *
 * @example
 * addFields({ CustomField });
 */
export const addFields = (components: Partial<FieldComponentRegistry>): void => {
  Object.assign(fieldComponents, components);
};

export default fieldComponents;
