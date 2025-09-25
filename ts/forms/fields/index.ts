import React from "react";

import jsFieldComponents from "../../../src/js/forms/fields.js";

import Field from "./field";
import SelectField from "./select-field";

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
  Field,
  SelectField,
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
