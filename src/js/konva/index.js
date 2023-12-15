import React from "react";
import konva from "react-konva";

const kComponents = {};
Object.keys(konva).forEach(k => {
  if (/^[A-Z]$/.test(k[0])) {
    const Component = konva[k];
    kComponents[k + 'Konva'] = React.forwardRef((props, ref) => {
      const konvaProps = { ...props, id: props.name, name: props.classes, ref };
      konvaProps.visible = props.active;
      delete konvaProps.active;
      return React.createElement(Component, konvaProps);
    });
    kComponents[k + 'Konva'].wrapper = false;
  }
});

export default kComponents;
