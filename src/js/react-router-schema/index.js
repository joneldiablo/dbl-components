import React from "react";
import {
  HashRouter,
  BrowserRouter,
  withRouter,
  Route,
} from "react-router-dom";

export default class SchemaController extends React.Component {

}

export const RouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return (<RController {...props} />);
}

export const BrowserRouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return (<BrowserRouter><RController {...props} /></BrowserRouter>);
}

export const HashRouterSchema = (props) => {
  let RController = withRouter(SchemaController);
  return (<HashRouter><RController {...props} /></HashRouter>);
}