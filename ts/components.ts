import jsComponents from "../src/js/components.js";
import Component from "./component";
import Icons from "./media/icons";
import Action from "./actions/action";
import Container from "./containers/container";
import Image from "./media/image";
import Video from "./media/video";

const COMPONENTS: Record<string, any> = {
  ...jsComponents,
  Component,
  Icons,
  Action,
  Container,
  Image,
  Video,
};

export const addComponents = (newComponents: Record<string, unknown>): void => {
  Object.assign(COMPONENTS, newComponents);
};

export default COMPONENTS;
