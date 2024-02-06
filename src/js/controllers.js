import TitleController from "./views/title-view";
import Controller from "./views/view";

const CONTROLLERS = {
  TitleController,
  Controller
};

export const addControllers = (controllers) => {
  Object.assign(CONTROLLERS, controllers);
}

export default CONTROLLERS;