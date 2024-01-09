import TitleView from "./views/title-view";
import View from "./views/view";

const VIEWS = {
  TitleView,
  View
};

export const addViews = (viewsExtra) => {
  Object.assign(VIEWS, viewsExtra);
}


export default VIEWS;