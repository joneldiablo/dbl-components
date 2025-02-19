import Icons from "./media/icons";
import Component from "./component";
import Image from "./media/image";
import ListContainer from "./containers/list-container";
import TabsContainer from "./containers/tabs-container";

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