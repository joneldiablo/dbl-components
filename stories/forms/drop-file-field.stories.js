import { useState } from "react";
import { action } from '@storybook/addon-actions';
import "bootstrap/scss/bootstrap.scss";
import DropFileField from "../../src/js/forms/fields/drop-file-field";
import "../assets/scss/forms.scss";

export default {
  title: 'Forms/DropFileField',
  component: DropFileField
};

const Template = (args) => <form onSubmit={(e) => { e.preventDefault(); action('onSubmit')(e) }}>
  <ul>{Object.keys(args).map(arg => <li key={arg}>{arg}</li>)}</ul>
  <DropFileField {...args} onChange={action('onChange')} />
  <br /><br />
  <button className="btn btn-primary" type="submit">Probar error</button>
</form>;

const TemplateChildren = (args) => {
  const [filled, setFilled] = useState(false);
  return <form onSubmit={(e) => { e.preventDefault(); action('onSubmit')(e) }}>
    <ul>{Object.keys(args).map(arg => <li key={arg}>{arg}</li>)}</ul>
    <DropFileField {...args} onChange={e => { setFilled(true); action('onChange')(e) }} >
      {filled ? <div>
        archivo seleccionado
        <img src="https://dummyimage.com/600x400/000/999" className="img-fluid" />
      </div> : <div>
          seleccionar archivo
          <img src="https://dummyimage.com/600x400/999/000" className="img-fluid" />
        </div>}
    </DropFileField>
    <br /><br />
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

export const withContent = TemplateChildren.bind({});
withContent.args = {
  accept: 'application/pdf',
  name: 'pdf',
  required: true,
  errorMessage: 'El archivo es requerido'
}