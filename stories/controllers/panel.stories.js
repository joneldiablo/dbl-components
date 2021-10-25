import React from "react";
import PanelController from "../../src/js/controllers/panel-controller/panel-controller";

export default {
  title: 'Diablo components/controllers',
  //component: PanelController
};

console.log('PanelController', PanelController);

const Template = (args) => <div {...args} ></div>;

export const panelController = Template.bind({});
panelController.args = {
  name: "panelEjemplo"
}



