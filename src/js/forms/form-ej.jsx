import React from "react";
import ToolBarContentContainer from "../../../MainContent/ToolBarContentContainer";
import { ToolBarStyle, Content } from "../../../styles/globalStyles";
import Form from './FormSchema';
import { t } from './i18n';

const FIELDS = [
  {
    name: 'name',
    label: t('Nombre'),
    placeholder: t('Nombre'),
    info: t('Escriba el nombre de la matriz.'),
    errorMessage: t('El nombre de la matriz es indispensable'),
    required: true
  },
  {
    name: 'address',
    label: t('Dirección'),
    placeholder: t('Dirección'),
    info: t('Escriba la dirección de la Matriz.'),
    errorMessage: t('La dirección es indispensable'),
    required: true
  },
  {
    name: 'zip',
    label: t('Código Postal'),
    placeholder: t('Código Postal'),
    info: t('Escriba el código postal de la Matriz.'),
    errorMessage: t('El código postal es indispensable'),
    required: true
  },
  {
    name: 'company',
    label: t('Compañía'),
    placeholder: t('Compañía'),
    info: t('Escriba el nombre de la compañía de la Matriz.'),
    errorMessage: t('La compañía es indispensable'),
    required: true
  },
  {
    name: 'tags',
    label: t('Etiquetas'),
    type: 'SelectBadges',
    placeholder: t('Seleccionar etiquetas'),
    info: t('Selecciona todas las etiquetas que consideres necesarias para identificar esta matriz.'),
    options: []
  }
];

const Template = ({ children }) => {
  return React.createElement(React.Fragment, {},
    React.createElement(ToolBarStyle, {},
      React.createElement(ToolBarContentContainer,
        {
          defaultIcons: true,
          title: t('Comercios'),
          subTitle: t('Matriz')
        }
      )
    ),
    React.createElement(Content, {},
      React.createElement('div',
        { style: { padding: 20 } },
        children
      )
    )
  );
}


export default class AppComponent extends React.Component {

  static defaultProps = {
    tags: []
  }

  state = {
    fields: FIELDS
  }

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tags.length !== this.props.tags.length) {
      let { tags } = this.props;
      //set options from tags
      FIELDS[4].options = tags.filter(tag => !!tag.name)
        .map(tag => ({ label: tag.name, value: tag._id }));
      this.setState({ fields: FIELDS });
    }
  }

  render() {
    let props = {
      fields: this.state.fields,
      onChange: (e, data) => console.log('ON_CHANGE', data),
      onSubmit: (e, data) => console.log('ON_SUBMIT', data),
      Template
    }
    return (React.createElement(React.Fragment, {},
      React.createElement(Form, { ...props })
    ));
  }
}
