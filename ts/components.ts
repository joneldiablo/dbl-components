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
import Link from "./navigation/react-router-link";
import NavLink from "./navigation/react-router-navlink";
import Route from "./react-router-schema/route";
import TabsContainer from "./containers/tabs-container";
import MenuItem from "./navigation/menu-item/menu-item";

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
  Link,
  NavLink,
  Route,
  TabsContainer,
  MenuItem,
};

export const addComponents = (newComponents: Record<string, unknown>): void => {
  Object.assign(COMPONENTS, newComponents);
};

export default COMPONENTS;
