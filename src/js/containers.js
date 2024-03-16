//import HeroContainer from "./containers/hero-container";
import Container from "./containers/container";

import AlertContainer from "./containers/alert-container/alert-container";
import AspectRatioContainer from "./containers/proportional-container";
import CardContainer from "./containers/card-container";
import DetailsContainer from "./containers/details-container";
import DndListContainer from "./containers/dnd-list-container";
import DropdownButtonContainer from "./containers/dropdown-button-container";
import DropdownContainer from "./containers/dropdown-container";
import FetchContainer from "./containers/fetch-container";
import FooterContainer from "./containers/footer-container";
import FormContainer from "./containers/form-container";
import FullscreenContainer from "./containers/fullscreen-container";
import GridContainer from "./containers/grid-container";
import GridSwitchContainer from "./containers/grid-switch-container";
import ListContainer from "./containers/list-container";
import ModalButtonContainer from "./containers/modal-button-container";
import ModalContainer from "./containers/modal-container";
import OffcanvasContainer from "./containers/offcanvas/offcanvas";
import PanelContainer from "./containers/panel-container/panel-container";
import ProportionalContainer from "./containers/proportional-container";
import SchemaContainer from "./react-router-schema/react-router-schema";
import ScrollContainer from "./containers/scroll-container";
import SlideContainer from "./containers/slide-container";
import TableContainer from "./containers/table-container";
import TabsContainer from "./containers/tabs-container";

const CONTAINERS = {
  Container,
  AlertContainer,
  AspectRatioContainer,
  CardContainer,
  DetailsContainer,
  DndListContainer,
  DropdownButtonContainer,
  DropdownContainer,
  FetchContainer,
  FooterContainer,
  FormContainer,
  FullscreenContainer,
  GridContainer,
  GridSwitchContainer,
  ListContainer,
  ModalButtonContainer,
  ModalContainer,
  OffcanvasContainer,
  PanelContainer,
  ProportionalContainer,
  SchemaContainer,
  ScrollContainer,
  SlideContainer,
  TableContainer,
  TabsContainer,
}

export const addContainers = (newContainers) => {
  Object.assign(CONTAINERS, newContainers);
}


export default CONTAINERS;