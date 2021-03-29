import DebugView from "./views/debug-view";
import TitleView from "./views/title-view";
import View from "./views/view";

const VIEWS = {
  DebugView,
  TitleView,
  View
};

export default VIEWS;
export const addViews = (viewsExtra) => {
  Object.assign(VIEWS, viewsExtra);
}