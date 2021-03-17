import React, { useEffect } from "react";
import { action } from "@storybook/addon-actions";
import PaginationField from "../../src/js/forms/fields/pagination-field";

export default {
  title: 'Forms/PaginationField',
  component: PaginationField
};

const Template = (args) => {
  useEffect(() => {
    console.log('ejecutando');
  }, []);
  return (<PaginationField {...args} />);
}

export const withOnChange = Template.bind({});
withOnChange.args = {
  name: 'paginator',
  total: 20,
  default: 1,
  paginationClasses: 'justify-content-center pagination-sm',
  onChange: action('onChange')
}


