export { default as Icons } from "./media/icons";
export { default as Component } from "./component";
export { default as Image } from "./media/image";
export { default as ListContainer } from "./containers/list-container";
export { default as TabsContainer } from "./containers/tabs-container";

const COMPONENTS = {
  Component,
  TabsContainer,
  Icons,
  Image,
  ListContainer,
}

export const addComponents = (newComponents) => {
  Object.assign(COMPONENTS, newComponents);
}


export default COMPONENTS;