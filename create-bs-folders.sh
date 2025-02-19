#!/bin/bash

# Define the main sections and their respective concepts
declare -A sections=(
    ["content"]="image table figure"
    ["forms"]="form-control select check radio range input-group floating-label"
    ["components"]="accordion alert badge breadcrumb button button-group card carousel close-button collapse dropdowns list-group modal navbar nav-tab offcanvas pagination placeholder popover progress scrollspy spinner toast tooltip"
)

# Function to convert dash-case to CamelCase
to_camel_case() {
    echo "$1" | awk 'BEGIN{FS="-";OFS=""}{for(i=1;i<=NF;i++)$i=toupper(substr($i,1,1)) substr($i,2)}1'
}

# Loop through each section
for section in "${!sections[@]}"; do
    echo "Creating folder for section: $section"
    mkdir -p "./src/js/bootstrap/$section" # Create a folder for the section

    # Split the concepts string into an array
    IFS=' ' read -ra concepts <<< "${sections[$section]}"

    # Loop through each concept in the current section
    for concept in "${concepts[@]}"; do
        concept_dir="./src/js/bootstrap/$section/$concept"
        echo "Creating folder for concept: $concept under section: $section"
        mkdir -p "$concept_dir" # Create a folder for the concept inside its section
        
        # Convert concept name to CamelCase for JS file
        ComponentName=$(to_camel_case "$concept")

        # Create and write content to JSON file
        cat > "$concept_dir/$concept.json" <<- EOM
{
  "view": {
    "tag": "div"
  },
  "definitions": {
  }
}
EOM
        # Create and write content to SCSS file
        echo ".$ComponentName{}" > "$concept_dir/$concept.scss"
        
        # Create JS file with content
        cat > "$concept_dir/$concept.js" <<- EOM
import { useLayoutEffect, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { resolveRefs } from "dbl-utils";

import JsonRender from "../../json-render";
import appCtrl from "../../app-controller";
import useEventHandler from "../../hooks/use-event-handler";

import schema from "./$concept.json";
import "./$concept.scss";

export function mutations(key, conf) {
  const name = key.replace(this.props.name + '-', '');
  switch (name) {
    default:
      break;
  }
}

const $ComponentName = (props) => {

  //hooks
  const [jsonRender, setJsonRender] = useState(false);
  const [schemaLocal, setSchema] = useState(false);
  
  useLayoutEffect((params) => {
    const jr = new JsonRender(props, mutations);
    jr.childrenIn = props.name + "-children$ComponentName";
    setJsonRender(jr);
    setSchema(resolveRefs(schema.view, { props, definitions: schema.definitions }));
  }, []);
  //----
  
  //events


  const events = [];
  const eventHandler = useEventHandler(events, [props.name, $ComponentName.jsClass].join('-'));
  //----

  // renders
  return jsonRender && schemaLocal ? jsonRender.buildContent(schemaLocal) : false;
}

$ComponentName.jsClass = '$ComponentName';
$ComponentName.defaultProps = {};
$ComponentName.propTypes = {};

export default $ComponentName;
EOM
    done
done

echo "All folders and files have been created successfully!"
