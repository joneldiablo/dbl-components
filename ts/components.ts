import jsComponents from "../src/js/components.js";
import Component from "./component";
import Icons from "./media/icons";

const COMPONENTS: Record<string, any> = {
  ...jsComponents,
  Component,
  Icons,
};

export const addComponents = (newComponents: Record<string, unknown>): void => {
  Object.assign(COMPONENTS, newComponents);
};

export default COMPONENTS;
