import jsContainers from "../src/js/containers.js";
import Container from "./containers/container";
import ProportionalContainer from "./containers/proportional-container";
import JsonRenderContainer from "./containers/json-render-container";
import FlexContainer from "./containers/flex-container";
import GridContainer from "./containers/grid-container";
import ListContainer from "./containers/list-container";
import TabsContainer from "./containers/tabs-container";

const CONTAINERS: Record<string, any> = {
  ...jsContainers,
  Container,
  ProportionalContainer,
  AspectRatioContainer: ProportionalContainer,
  JsonRenderContainer,
  FlexContainer,
  GridContainer,
  ListContainer,
  TabsContainer,
};

export const addContainers = (newContainers: Record<string, unknown>): void => {
  Object.assign(CONTAINERS, newContainers);
};

export default CONTAINERS;
