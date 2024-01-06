export { default as TitleController } from "./views/title-view";
export { default as Controller } from "./views/view";

const CONTROLLERS = {
  TitleController,
  Controller
};

export const addControllers = (controllers) => {
  Object.assign(CONTROLLERS, controllers);
}


export default CONTROLLERS;