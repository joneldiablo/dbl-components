import TitleController from "./views/title-view";
import Controller from "./views/view";

const CONTROLLERS = {
  TitleController,
  Controller
};

export default CONTROLLERS;
export const addControllers = (controllers: any) => {
  Object.assign(CONTROLLERS, controllers);
}