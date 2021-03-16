import { action } from '@storybook/addon-actions';
import "bootstrap/scss/bootstrap.scss";
import DateRangeField from "../../src/js/forms/fields/date-range-field";

export default {
  title: 'Forms/DateRangeField',
  component: DateRangeField
};

const Template = (args) => <form onSubmit={(e) => { e.preventDefault(); action('onSubmit')(e) }}>
  <ul>{Object.keys(args).map(arg => <li key={arg}>{arg}</li>)}</ul>
  <DateRangeField {...args} onChange={action('onChange')} />
  <br /><br />
  <button className="btn btn-primary" type="submit">Probar error</button>
</form>;

export const defaultRange = Template.bind({});
defaultRange.args = {
  label: 'Periodo',
  placeholder: 'Periodo',
  name: 'created_at',
  inline: true,
  required: true,
  default: ['2020-01-01', '2020-12-31'],
  errorMessage: "Ingresa un perido de tiempo válido"
}