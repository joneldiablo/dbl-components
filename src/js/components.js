import { NavLink, Link } from "react-router-dom";
import FooterContainer from "./containers/footer-container";
import FullscreenContainer from "./containers/fullscreen-container";
import Icons from "./media/icons";
import Svg from "./media/svg";
import Navbar from "./navigation/navbar";
import Container from "./containers/container";
import GridContainer from "./containers/grid-container";
import HeroContainer from "./containers/hero-container";
import AspectRatioContainer from "./containers/aspect-ratio-container";
import GridSwitchContainer from "./containers/grid-switch-container";
import CardContainer from "./containers/card-container";
import Debug from "./debug-component";
import Navigation, { ToggleTextNavigation } from "./navigation/navigation";
import BrandNavigation from "./navigation/brand-navigation";
import YoutubeVideoComponent from "./media/youtube-video";
import Component from "./component";
import Form from "./forms/form";
import Table from "./tables/table";
import EndpointTable from "./tables/endpoint-table";
import DropdownButtonContainer from "./containers/dropdown-button-container";
import fields from "./forms/fields";

const COMPONENTS = {
  Debug,
  Component,
  Container,
  GridContainer,
  GridSwitchContainer,
  HeroContainer,
  CardContainer,
  AspectRatioContainer,
  Navigation,
  BrandNavigation,
  YoutubeVideoComponent,
  ToggleTextNavigation,
  Table,
  EndpointTable,
  DropdownButtonContainer,
  Form,
  ...fields,
  NavLink,
  Link,
  Icons
}

export default COMPONENTS;

export const addComponents = (newComponents) => {
  Object.assign(COMPONENTS, newComponents);
}
