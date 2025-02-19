import { useLayoutEffect, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { resolveRefs } from "dbl-utils";

import JsonRender from "../../json-render";
import appCtrl from "../../app-controller";
import useEventHandler from "../../hooks/use-event-handler";

import schema from "./range.json";
import "./range.scss";

export function mutations(key, conf) {
  const name = key.replace(this.props.name + '-', '');
  switch (name) {
    default:
      break;
  }
}

const Range = (props) => {

  //hooks
  const [jsonRender, setJsonRender] = useState(false);
  const [schemaLocal, setSchema] = useState(false);
  
  useLayoutEffect((params) => {
    const jr = new JsonRender(props, mutations);
    jr.childrenIn = props.name + "-childrenRange";
    setJsonRender(jr);
    setSchema(resolveRefs(schema.view, { props, definitions: schema.definitions }));
  }, []);
  //----
  
  //events


  const events = [];
  const eventHandler = useEventHandler(events, [props.name, Range.jsClass].join('-'));
  //----

  // renders
  return jsonRender && schemaLocal ? jsonRender.buildContent(schemaLocal) : false;
}

Range.jsClass = 'Range';
Range.defaultProps = {};
Range.propTypes = {};

export default Range;
