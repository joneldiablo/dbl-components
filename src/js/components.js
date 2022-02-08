import FooterContainer from "./containers/footer-container";
import FullscreenContainer from "./containers/fullscreen-container";
import Icons from "./media/icons";
import Svg from "./media/svg";
import Navbar from "./navigation/navbar";
import Component from "./component";
import Image from "./media/image";
import Container from "./containers/container";
import GridContainer from "./containers/grid-container";
import ListContainer from "./containers/list-container";
import SlideContainer from "./containers/slide-container";
//import HeroContainer from "./containers/hero-container";
import AspectRatioContainer from "./containers/proportional-container";
import GridSwitchContainer from "./containers/grid-switch-container";
import CardContainer from "./containers/card-container";
import ProportionalContainer from "./containers/proportional-container";
import Debug from "./debug-component";
import Navigation, { ToggleTextNavigation } from "./navigation/navigation";
import BrandNavigation from "./navigation/brand-navigation";
import YoutubeVideoComponent from "./media/youtube-video";
import FormContainer from "./containers/form-container";
import Form from "./forms/form";
import Table from "./tables/table";
import EndpointTable from "./tables/endpoint-table";
import DropdownButtonContainer from "./containers/dropdown-button-container";
import ModalButtonContainer from "./containers/modal-button-container";
import ModalContainer from "./containers/modal-container";
import TabsContainer from "./containers/tabs-container";
import DetailsContainer from "./containers/details-container";
import DndListContainer from "./containers/dnd-list-container";
import fields from "./forms/fields";
import Action from "./actions/action";
import Link from "./navigation/react-router-link";
import NavLink from "./navigation/react-router-navlink";
import { RouterSchema } from "./react-router-schema/react-router-schema";
import PanelContainer from "./containers/panel-container/panel-container";
import FetchContainer from "./containers/fetch-container";
import Video from "./media/video";

const COMPONENTS = {
  Debug,
  Component,
  Container,
  GridContainer,
  GridSwitchContainer,
  //HeroContainer,
  CardContainer,
  AspectRatioContainer,
  Navigation,
  BrandNavigation,
  YoutubeVideoComponent,
  ToggleTextNavigation,
  Table,
  EndpointTable,
  DropdownButtonContainer,
  ModalButtonContainer,
  ModalContainer,
  ProportionalContainer,
  TabsContainer,
  DetailsContainer,
  FormContainer,
  Form,
  ...fields,
  NavLink,
  Link,
  Icons,
  Image,
  Action,
  ListContainer,
  SlideContainer,
  RouterSchema,
  PanelContainer,
  FetchContainer,
  Video,
  DndListContainer
}

export default COMPONENTS;

export const addComponents = (newComponents) => {
  Object.assign(COMPONENTS, newComponents);
}
