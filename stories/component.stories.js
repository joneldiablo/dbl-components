import Component from "../src/js/component";

export default {
  title: 'React Components/Component',
  component: Component
};

const Template = (args) => {
  return (<>
    <p>Basic component</p>
    <Component {...args}>
      <p>Componente básico, agrega una etiqueta wrapper con clases y estilos. Pensado para heredar de él. Es el elemento default de ReactRouterSchema</p>
    </Component>
  </>);
};

export const defaultComponent = Template.bind({});
defaultComponent.args = {
  name: 'component',
  classes: 'bg-light',
  style: { width: 300, height: 400 }
};