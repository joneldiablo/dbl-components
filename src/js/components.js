//import HeroContainer from "./containers/hero-container";
export { default as FooterContainer } from "./containers/footer-container";
export { default as FullscreenContainer } from "./containers/fullscreen-container";
export { default as Icons } from "./media/icons";
export { default as Svg } from "./media/svg";
export { default as Navbar } from "./navigation/navbar";
export { default as Component } from "./component";
export { default as Image } from "./media/image";
export { default as Container } from "./containers/container";
export { default as GridContainer } from "./containers/grid-container";
export { default as ListContainer } from "./containers/list-container";
export { default as SlideContainer } from "./containers/slide-container";
export { default as AspectRatioContainer } from "./containers/proportional-container";
export { default as GridSwitchContainer } from "./containers/grid-switch-container";
export { default as CardContainer } from "./containers/card-container";
export { default as ProportionalContainer } from "./containers/proportional-container";
export { default as Navigation, ToggleTextNavigation } from "./navigation/navigation";
export { default as BrandNavigation } from "./navigation/brand-navigation";
export { default as YoutubeVideoComponent } from "./media/youtube-video";
export { default as FormContainer } from "./containers/form-container";
export { default as Form } from "./forms/form";
export { default as Table } from "./tables/table";
export { default as DropdownButtonContainer } from "./containers/dropdown-button-container";
export { default as DropdownContainer } from "./containers/dropdown-container";
export { default as ModalButtonContainer } from "./containers/modal-button-container";
export { default as ModalContainer } from "./containers/modal-container";
export { default as TabsContainer } from "./containers/tabs-container";
export { default as DetailsContainer } from "./containers/details-container";
export { default as DndListContainer } from "./containers/dnd-list-container";
export { default as Action } from "./actions/action";
export { default as Link } from "./navigation/react-router-link";
export { default as NavLink } from "./navigation/react-router-navlink";
export { default as PanelContainer } from "./containers/panel-container/panel-container";
export { default as FetchContainer } from "./containers/fetch-container";
export { default as Video } from "./media/video";
export { default as MenuItem } from "./navigation/menu-item/menu-item";
export { default as TableContainer } from "./containers/table-container";
export { default as AlertContainer } from "./containers/alert-container/alert-container";
export { default as SchemaContainer } from "./react-router-schema/react-router-schema";
export { default as fields } from "./forms/fields";
export * from "./forms/fields";

const COMPONENTS = {
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
  DropdownButtonContainer,
  DropdownContainer,
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
  PanelContainer,
  FetchContainer,
  Video,
  DndListContainer,
  MenuItem,
  TableContainer,
  AlertContainer,
  SchemaContainer
}

export const addComponents = (newComponents) => {
  Object.assign(COMPONENTS, newComponents);
}


export default COMPONENTS;