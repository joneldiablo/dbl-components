import { useLayoutEffect, useState, useEffect } from "react";
import PropTypes from "prop-types";

import JsonRender from "../../json-render";
import appCtrl from "../../app-controller";

import resolveRefs from "../../functions/resolve-refs";
import useEventHandler from "../../hooks/use-event-handler";

import schema from "./radio.json";
import "./radio.scss";

export function mutations(key, conf) {
  const name = key.replace(this.props.name + '-', '');
  switch (name) {
    default:
      break;
  }
}

const Radio = (props) => {

  //hooks
  const [jsonRender, setJsonRender] = useState(false);
  const [schemaLocal, setSchema] = useState(false);
  
  useLayoutEffect((params) => {
    const jr = new JsonRender(props, mutations);
    jr.childrenIn = props.name + "-childrenRadio";
    setJsonRender(jr);
    setSchema(resolveRefs(schema.view, { props, definitions: schema.definitions }));
  }, []);
  //----
  
  //events


  const events = [];
  const eventHandler = useEventHandler(events, [props.name, Radio.jsClass].join('-'));
  //----

  // renders
  return jsonRender && schemaLocal ? jsonRender.buildContent(schemaLocal) : false;
}

Radio.jsClass = 'Radio';
Radio.defaultProps = {};
Radio.propTypes = {};

export default Radio;
