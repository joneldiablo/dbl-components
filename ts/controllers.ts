import jsControllers from "../src/js/controllers.js";
import TitleView from "./views/title-view";
import View from "./views/view";

const CONTROLLERS: Record<string, any> = {
  ...jsControllers,
  TitleController: TitleView,
  Controller: View,
};

/**
 * Merge additional controllers into the registry.
 */
export const addControllers = (
  controllers: Record<string, unknown>
): void => {
  Object.assign(CONTROLLERS, controllers);
};

export default CONTROLLERS;

