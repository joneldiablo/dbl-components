import React from "react";
import Select from "../../src/js/forms/fields/material/select-field";

export default {
  title: 'Diablo components/Fields',
};

export const selectMaterial = () => {
  const selectProps = {
    label: 'Seleciona el País',
    name: 'country',
    options: [
      { value: '', label: 'Seleciona el País' },
      { value: 'mx', label: 'México' },
      { value: 'us', label: 'United States' },
      { value: 'es', label: 'España' }
    ],
    required: true,
    errorMessage: 'Este campo es obligatorio'
  }
  return <div style={{padding: 20}}>
    <br />
    <Select {...selectProps} />
  </div>
};

