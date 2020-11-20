import React from "react";
import Form from "../src/js/forms/form";
import schemaManager from "../src/js/functions/schema-manager";
import suppliersSchema from "./assets/schemas/suppliers.json";

schemaManager.schema = suppliersSchema;

export default {
  title: 'Diablo components/Forms'
};

export const formDefault = () => <Form {...suppliersSchema} />;

