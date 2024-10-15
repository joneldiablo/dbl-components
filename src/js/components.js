import Action from "./actions/action";
import BrandNavigation from "./navigation/brand-navigation";
import Component from "./component";
import Form from "./forms/form";
import Icons from "./media/icons";
import Image from "./media/image";
import Link from "./navigation/react-router-link";
import MenuItem from "./navigation/menu-item/menu-item";
import Navbar from "./navigation/navbar";
import Navigation, { ToggleTextNavigation } from "./navigation/navigation";
import NavLink from "./navigation/react-router-navlink";
import Svg from "./media/svg";
import SvgImports from "./media/svg-imports";
import Table from "./tables/table";
import Video from "./media/video";
import YoutubeVideo from "./media/youtube-video";
import fields from "./forms/fields";
import containers from "./containers";

const COMPONENTS = {
  Action,
  BrandNavigation,
  Component,
  Form,
  Icons,
  SvgImports,
  Image,
  Link,
  MenuItem,
  Navigation,
  NavLink,
  Table,
  ToggleTextNavigation,
  Video,
  YoutubeVideo,
  ...containers,
  ...fields,
}

export const addComponents = (newComponents) => {
  Object.assign(COMPONENTS, newComponents);
}


export default COMPONENTS;