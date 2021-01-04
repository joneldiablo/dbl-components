import React from "react";
import Form from "../../src/js/forms/form";
import schemaManager from "../../src/js/functions/schema-manager";
import suppliersSchema from "../assets/schemas/suppliers.json";
import { action } from '@storybook/addon-actions';

schemaManager.schema = suppliersSchema;

export default {
  title: 'Forms/Form',
  component: Form,
  parameters: { actions: { argTypesRegex: '^on.*' } },
};

export const formDefault = () => {
  const schema = {
    "clearAfterDone": true,
    "fields": [
      {
        "label": "Tipo de proveedor",
        "type": "hidden",
        "name": "tipo",
        "required": true,
        "errorMessage": "Este campo es indispensable."
      },
      {
        "label": "Razón Social",
        "name": "razon",
        "type": "text",
        "placeholder": "Escribe una razón social",
        "required": true,
        "errorMessage": "Este campo es indispensable."
      },
      {
        "label": "ID",
        "name": "rfc",
        "type": "text",
        "placeholder": "Selecciona un tipo de proveedor",
        "required": false,
        "errorMessage": "Este campo es indispensable.",
        "disabled": true
      },
      {
        "label": "Correo",
        "name": "correo",
        "type": "email",
        "placeholder": "Escribe un correo ",
        "pattern": "[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
        "required": true,
        "errorMessage": "Escribe un correo válido, ej. nombre@email.com"
      },
      {
        "label": "Nombre de contacto",
        "name": "nombreContacto",
        "type": "text",
        "placeholder": "Escribe el nombre de contacto",
        "required": true,
        "errorMessage": "Este campo es indispensable."
      },
      {
        "label": "Teléfono de contacto",
        "name": "telefonoContacto",
        "type": "tel",
        "placeholder": "Escribe el teléfono de contacto",
        "pattern": "[0-9]{10}",
        "required": true,
        "errorMessage": "Por favor, ingresa 10 dígitos únicamente, ej. 5500000000"
      },
      {
        "label": "Autorizado por",
        "name": "autorizacion",
        "type": "text",
        "placeholder": "Asigna un responsable",
        "required": true,
        "errorMessage": "Este campo es indispensable."
      },
      {
        "label": "Requiere orden de compra",
        "name": "oc",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Requiere XML",
        "name": "xml",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Requiere PDF",
        "name": "pdf",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Requiere archivo adicional",
        "name": "aa",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Requiere validar RFC",
        "name": "rfcValidar",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Requiere comprobante de pago",
        "name": "comprobantePago",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Requiere notificar pago",
        "name": "notificarPago",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Restringir carga de CFDIs",
        "name": "restringirCarga",
        "type": "select",
        "options": "$definitions.optionsBoolean",
        "required": true
      },
      {
        "label": "Activo",
        "name": "activo",
        "type": "select",
        "placeholder": "Selecciona una opción",
        "options": "$definitions.optionsBoolean",
        "required": true
      }
    ],
    "definitions": {
      "optionsBoolean": [
        {
          "label": "No",
          "value": false
        },
        {
          "label": "Sí",
          "value": true
        }
      ]
    }
  }

  return (<div>
    <Form {...schema} onSubmit={action('onSubmit')} onChange={action('onChange')}>
      <button className="btn btn-primary mb-3" type="submit">Enviar</button>
    </Form>
  </div>);
}

