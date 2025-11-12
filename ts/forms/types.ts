import type { FieldOption } from "./fields/field";

/**
 * JSON schema definition describing a single field used by {@link Form} and {@link Group} components.
 *
 * @example
 * const field: FieldDefinition = { name: "email", type: "Field", placeholder: "Email" };
 */
export interface FieldDefinition extends Record<string, any> {
  type?: string;
  name?: string;
  classes?: string | string[];
  colClasses?: string | string[];
  fields?: FieldDefinition[];
  options?: FieldOption[];
  default?: any;
}

/**
 * Payload accepted by {@link Form} updates dispatched through the event bus.
 *
 * @example
 * const payload: FormUpdatePayload = { loading: true };
 */
export interface FormUpdatePayload {
  data?: Record<string, any>;
  loading?: boolean;
  reset?: boolean;
}
