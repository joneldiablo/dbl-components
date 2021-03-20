import { useEffect } from "react";
import { action } from '@storybook/addon-actions';
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import DropFileField from "../../src/js/forms/fields/drop-file-field";
import "../assets/scss/forms.scss";

export default {
  title: 'React Components/Fields/DropFileField',
  component: DropFileField
};

const Template = (args) => {
  useEffect(() => {
    eventHandler.subscribe('pdf-DropFileField pdf_fill-DropFileField', action('onChange'));
  }, []);
  /*  useEffect(() => {
     eventHandler.unsubscribe('name-Field pass-Field email-Field');
   }, []); */

  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e); }}>
    <DropFileField {...args} />
    <br />
    <button className="btn btn-primary" type="submit">Probar error</button>
  </form>
};

export const withLabel = Template.bind({});
withLabel.args = {
  accept: 'application/pdf',
  label: 'seleccionar archivo',
  name: 'pdf',
  required: true,
  errorMessage: 'El archivo es requerido',
  multiple: true
}

export const withContent = Template.bind({});
withContent.args = {
  accept: 'application/pdf',
  name: 'pdf_fill',
  required: true,
  errorMessage: 'El archivo es requerido',
  children: [
    <div key="empty">
      <span>seleccionar archivo</span>
      <img src="https://dummyimage.com/600x400/999/000" className="img-fluid" />
    </div>,
    <div key="filled">
      <span>archivo seleccionado YA</span>
      <img src="https://dummyimage.com/600x400/000/999" className="img-fluid" />
    </div>
  ]
}