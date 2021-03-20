import React, { useEffect, useState } from "react";
import { action } from "@storybook/addon-actions";
import "bootstrap/scss/bootstrap.scss";

import eventHandler from "../../src/js/functions/event-handler";
import PaginationField from "../../src/js/forms/fields/pagination-field";

export default {
  title: 'React Components/Fields/PaginationField',
  component: PaginationField
};

const Template = (args) => {
  const setOne = () => {
    eventHandler.dispatch('update.paginator-PaginationField', { value: 1, total });
  }
  const onClickTotal = () => {
    setTotal(total === 20 ? 50 : 20);
  }
  const [total, setTotal] = useState(20);
  useEffect(() => {
    eventHandler.subscribe('paginator-PaginationField', action('onChange'));
  }, []);
  useEffect(() => {
    setOne();
  }, [total]);
  /*  useEffect(() => {
     eventHandler.unsubscribe('name-Field pass-Field email-Field');
   }, []); */
  return <form onSubmit={e => { e.preventDefault(); action('onSubmit')(e); }}>
    <PaginationField {...args} total={total} />
    <br />
    <button className="btn btn-primary" type="submit">Probar error</button>
    <button className="btn btn-primary ms-2" type="button" onClick={setOne}>Mandar a página 1</button>
    <button className="btn btn-primary ms-2" type="button" onClick={onClickTotal}>Cambiar total ({total})</button>
  </form>
};

export const withOnChange = Template.bind({});
withOnChange.args = {
  name: 'paginator',
  total: 20,
  default: 1,
  paginationClasses: 'justify-content-center pagination-sm'
}


