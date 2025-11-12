import jsViews from "../src/js/views.js";
import TitleView from "./views/title-view";
import View from "./views/view";

const VIEWS: Record<string, any> = {
  ...jsViews,
  TitleView,
  View,
};

/**
 * Merge additional view components into the registry.
 */
export const addViews = (viewsExtra: Record<string, unknown>): void => {
  Object.assign(VIEWS, viewsExtra);
};

export default VIEWS;

