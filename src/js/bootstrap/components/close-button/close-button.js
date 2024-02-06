import { useLayoutEffect, useState, useEffect } from "react";
import PropTypes from "prop-types";

import JsonRender from "../../json-render";
import appCtrl from "../../app-controller";

import resolveRefs from "../../functions/resolve-refs";
import useEventHandler from "../../hooks/use-event-handler";

import schema from "./close-button.json";
import "./close-button.scss";

export function mutations(key, conf) {
  const name = key.replace(this.props.name + '-', '');
  switch (name) {
    default:
      break;
  }
}

const CloseButton = (props) => {

  //hooks
  const [jsonRender, setJsonRender] = useState(false);
  const [schemaLocal, setSchema] = useState(false);
  
  useLayoutEffect((params) => {
    const jr = new JsonRender(props, mutations);
    jr.childrenIn = props.name + "-childrenCloseButton";
    setJsonRender(jr);
    setSchema(resolveRefs(schema.view, { props, definitions: schema.definitions }));
  }, []);
  //----
  
  //events


  const events = [];
  const eventHandler = useEventHandler(events, [props.name, CloseButton.jsClass].join('-'));
  //----

  // renders
  return jsonRender && schemaLocal ? jsonRender.buildContent(schemaLocal) : false;
}

CloseButton.jsClass = 'CloseButton';
CloseButton.defaultProps = {};
CloseButton.propTypes = {};

export default CloseButton;
