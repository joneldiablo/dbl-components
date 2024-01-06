export { default as TitleView } from "./views/title-view";
export { default as View } from "./views/view";

const VIEWS = {
  TitleView,
  View
};

export const addViews = (viewsExtra) => {
  Object.assign(VIEWS, viewsExtra);
}


export default VIEWS;