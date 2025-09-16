import jsComponents from "../src/js/components.js";
import Component from "./component";
import Icons from "./media/icons";
import Action from "./actions/action";
import Container from "./containers/container";
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
import ServiceListNavigation from "./navigation/service-list-navigation";
import Field from "./forms/fields/field";
import SelectField from "./forms/fields/select-field";
import SelectLanguage from "./i18n/select-language";

const COMPONENTS: Record<string, any> = {
  ...jsComponents,
  Component,
  Icons,
  Action,
  Container,
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
  ServiceListNavigation,
  Field,
  SelectField,
  SelectLanguage,
};

export const addComponents = (newComponents: Record<string, unknown>): void => {
  Object.assign(COMPONENTS, newComponents);
};

export default COMPONENTS;
