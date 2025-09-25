import jsComponents from "../src/js/components.js";
import Component from "./component";
import Icons from "./media/icons";
import Action from "./actions/action";
import Container from "./containers/container";
import FloatingContainer from "./containers/floating-container";
import Image from "./media/image";
import Video from "./media/video";
import ProportionalContainer from "./containers/proportional-container";
import Svg from "./media/svg";
import YoutubeVideoComponent from "./media/youtube-video";
import SvgImports from "./media/svg-imports";
import JsonRenderComponent from "./json-render-component";
import Link from "./navigation/react-router-link";
import NavLink from "./navigation/react-router-navlink";
import Route from "./react-router-schema/route";
import TabsContainer from "./containers/tabs-container";
import MenuItem from "./navigation/menu-item/menu-item";
import Navbar from "./navigation/navbar";
import Navigation, { ToggleTextNavigation } from "./navigation/navigation";
import BrandNavigation from "./navigation/brand-navigation";
import CardListNavigation from "./navigation/card-list-navigation";
import CardsNavigation from "./navigation/cards-navigation";
import HeaderNavigation from "./navigation/header-navigation";
import ServiceListNavigation from "./navigation/service-list-navigation";
import SideNavigation from "./navigation/side-navigation";
import Field from "./forms/fields/field";
import SelectField from "./forms/fields/select-field";
import Form from "./forms/form";
import Group from "./forms/groups/group";
import CardGroup from "./forms/groups/card-group";
import GridGroup from "./forms/groups/grid-group";
import SelectLanguage from "./i18n/select-language";
import Image from "./media/image";
import Video from "./media/video";

const COMPONENTS: Record<string, any> = {
  ...jsComponents,
  Component,
  Icons,
  Action,
  Container,
  FloatingContainer,
  Image,
  Video,
  ProportionalContainer,
  AspectRatioContainer: ProportionalContainer,
  Svg,
  YoutubeVideo: YoutubeVideoComponent,
  SvgImports,
  JsonRenderComponent,
  Link,
  NavLink,
  Route,
  TabsContainer,
  MenuItem,
  Navbar,
  Navigation,
  ToggleTextNavigation,
  BrandNavigation,
  CardListNavigation,
  CardsNavigation,
  HeaderNavigation,
  ServiceListNavigation,
  SideNavigation,
  Field,
  SelectField,
  Form,
  Group,
  CardGroup,
  GridGroup,
  SelectLanguage,
  Image,
  Video,
};

export const addComponents = (newComponents: Record<string, unknown>): void => {
  Object.assign(COMPONENTS, newComponents);
};

export default COMPONENTS;
