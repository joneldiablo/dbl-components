import jsContainers from "../src/js/containers.js";
import Container from "./containers/container";
import ProportionalContainer from "./containers/proportional-container";
import JsonRenderContainer from "./containers/json-render-container";
import FlexContainer from "./containers/flex-container";
import FloatingContainer from "./containers/floating-container";
import GridContainer from "./containers/grid-container";
import ListContainer from "./containers/list-container";
import TabsContainer from "./containers/tabs-container";
import AlertContainer from "./containers/alert-container/alert-container";
import AutoResponsiveContainer from "./containers/auto-responsive-container";
import CardContainer from "./containers/card-container";
import DetailsContainer from "./containers/details-container";
import DropdownButtonContainer from "./containers/dropdown-button-container";
import DropdownContainer from "./containers/dropdown-container";
import DndListContainer from "./containers/dnd-list-container";

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
  FloatingContainer,
  AlertContainer,
  AutoResponsiveContainer,
  CardContainer,
  DetailsContainer,
  DropdownButtonContainer,
  DropdownContainer,
  DndListContainer,
};

export const addContainers = (newContainers: Record<string, unknown>): void => {
  Object.assign(CONTAINERS, newContainers);
};

export default CONTAINERS;
